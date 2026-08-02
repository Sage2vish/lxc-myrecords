-- Tracks issued refresh tokens / API keys so they can be looked up and
-- revoked. JWT access tokens themselves stay stateless (verified via
-- JWT_SECRET); this table is the revocation/audit side. product_id is the
-- "which product/service is this login scoped to" piece of the
-- product-aware auth design.
CREATE TABLE IF NOT EXISTS apim_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  token_type ENUM('refresh', 'api_key') NOT NULL DEFAULT 'refresh',
  token_hash VARCHAR(255) NOT NULL,
  expires_at DATETIME NULL,
  revoked_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_apim_tokens_user FOREIGN KEY (user_id) REFERENCES apim_users (id) ON DELETE CASCADE,
  CONSTRAINT fk_apim_tokens_product FOREIGN KEY (product_id) REFERENCES apim_products (id) ON DELETE CASCADE,
  INDEX idx_apim_tokens_token_hash (token_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
