-- Roles are global to the lxc-apim admin/catalog surface (e.g. admin,
-- developer, viewer) — not per-product. Which product a *login* is scoped to
-- is tracked separately on apim_tokens, not here.
CREATE TABLE IF NOT EXISTS apim_roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(128) NOT NULL,
  description TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS apim_user_roles (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_apim_user_roles_user FOREIGN KEY (user_id) REFERENCES apim_users (id) ON DELETE CASCADE,
  CONSTRAINT fk_apim_user_roles_role FOREIGN KEY (role_id) REFERENCES apim_roles (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
