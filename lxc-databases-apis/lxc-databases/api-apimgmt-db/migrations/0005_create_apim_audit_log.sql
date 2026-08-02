-- Auth/access audit trail — login attempts, token revocations, admin actions.
CREATE TABLE IF NOT EXISTS apim_audit_log (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  product_id INT NULL,
  action VARCHAR(64) NOT NULL,
  ip_address VARCHAR(64) NULL,
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_apim_audit_log_user FOREIGN KEY (user_id) REFERENCES apim_users (id) ON DELETE SET NULL,
  CONSTRAINT fk_apim_audit_log_product FOREIGN KEY (product_id) REFERENCES apim_products (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
