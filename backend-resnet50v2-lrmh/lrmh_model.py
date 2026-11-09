"""
Mô-đun kiến trúc mô hình ResNet50V2 kết hợp Khối chú ý đa đầu trái - phải (LRMH-Attention)
và thuật toán tích hợp mức độ ưu tiên L = min(LLS, LCLS) theo mô tả sáng chế/GPHI preMediK.
"""
import tensorflow as tf
from tensorflow.keras import layers, Model

class LeftRightMultiHeadAttention(layers.Layer):
    """
    Bước S4: Khối chú ý đa đầu trái - phải (LRMH)
    - Tách bản đồ đặc trưng X (H x W x C) theo chiều rộng với tỉ lệ alpha = 0.5:
      W_split = floor(W * alpha). Với W=7, alpha=0.5 -> W_split=3 (cột 0..2 và cột 4..6; bỏ qua cột giữa 3 - vùng trung thất).
    - Áp dụng MHSA độc lập cho từng luồng (4 đầu chú ý, d_k = 64, dropout r = 0.1).
    - Hợp nhất Y_fused -> FFN (ẩn 1024, ra 256) + kết nối phần dư + LayerNorm -> Z.
    """
    def __init__(self, num_heads=4, key_dim=64, alpha=0.5, dropout_rate=0.1, ffn_hidden=1024, ffn_out=256, **kwargs):
        super().__init__(**kwargs)
        self.num_heads = num_heads
        self.key_dim = key_dim
        self.alpha = alpha
        self.dropout_rate = dropout_rate
        self.ffn_hidden = ffn_hidden
        self.ffn_out = ffn_out

        self.mhsa_left = layers.MultiHeadAttention(num_heads=num_heads, key_dim=key_dim, dropout=dropout_rate)
        self.mhsa_right = layers.MultiHeadAttention(num_heads=num_heads, key_dim=key_dim, dropout=dropout_rate)
        self.drop_left = layers.Dropout(dropout_rate)
        self.drop_right = layers.Dropout(dropout_rate)
        self.norm_left = layers.LayerNormalization(epsilon=1e-6)
        self.norm_right = layers.LayerNormalization(epsilon=1e-6)

        self.ffn_dense1 = layers.Dense(ffn_hidden, activation="relu")
        self.ffn_dense2 = layers.Dense(ffn_out)
        self.proj_residual = layers.Dense(ffn_out)
        self.drop_final = layers.Dropout(dropout_rate)
        self.norm_final = layers.LayerNormalization(epsilon=1e-6)

    def call(self, x, training=False):
        # x shape: (B, H, W, C) e.g. (B, 7, 7, 2048)
        shape = tf.shape(x)
        b, h, w, c = shape[0], shape[1], shape[2], x.shape[-1]
        w_split = int(x.shape[2] * self.alpha)  # 3 when W=7, alpha=0.5

        # S4.1: Tách 2 luồng trái (0 : w_split) và phải (W - w_split : W), bỏ qua cột trung thất
        x_left = x[:, :, :w_split, :]
        x_right = x[:, :, (x.shape[2] - w_split):, :]

        # S4.2: Chuyển thành chuỗi token N = H * W_split = 21
        n_tokens = x.shape[1] * w_split
        tokens_left = tf.reshape(x_left, (-1, n_tokens, c))
        tokens_right = tf.reshape(x_right, (-1, n_tokens, c))

        # S4.3: Tự chú ý đa đầu độc lập
        attn_left = self.mhsa_left(tokens_left, tokens_left, training=training)
        y_left = self.norm_left(tokens_left + self.drop_left(attn_left, training=training))

        attn_right = self.mhsa_right(tokens_right, tokens_right, training=training)
        y_right = self.norm_right(tokens_right + self.drop_right(attn_right, training=training))

        # S4.4: Hợp nhất hai luồng (42 token)
        y_fused = tf.concat([y_left, y_right], axis=1)

        # S4.5: Biến đổi truyền thẳng FFN + phần dư + LayerNorm
        ffn_out = self.ffn_dense2(self.ffn_dense1(y_fused))
        res = self.proj_residual(y_fused)
        z = self.norm_final(res + self.drop_final(ffn_out, training=training))
        return z


def build_resnet50v2_lrmh_model(input_shape=(224, 224, 3), num_classes=3):
    inputs = layers.Input(shape=input_shape, name="xray_input")
    # Bước S3: Mạng xương sống ResNet50V2 tiền huấn luyện ImageNet -> (7, 7, 2048)
    backbone = tf.keras.applications.ResNet50V2(
        include_top=False, weights="imagenet", input_tensor=inputs
    )
    feature_map = backbone.output
    # Bước S4: Khối LRMH
    z = LeftRightMultiHeadAttention(name="lrmh_attention")(feature_map)
    # Bước S5: GAP + Dense(3) + Softmax -> p = (p_Normal, p_Pneumonia, p_TB)
    gap = layers.GlobalAveragePooling1D(name="global_avg_pool")(z)
    outputs = layers.Dense(num_classes, activation="softmax", name="probs_output")(gap)
    return Model(inputs=inputs, outputs=outputs, name="preMediK_ResNet50V2_LRMH")
