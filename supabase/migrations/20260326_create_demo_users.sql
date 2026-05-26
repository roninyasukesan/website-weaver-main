INSERT INTO auth.users (id, email, encrypted_password, user_metadata, raw_user_meta_data, raw_app_meta_data, created_at, updated_at, last_sign_in_at, confirmed_at, email_confirmed_at,invited_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@keliane.adv.br', 'argon2---', '{"full_name": "Administrador Keliane Machado"}', '{"full_name": "Administrador Keliane Machado"}', '{"provider": "email", "providers": ["email"]}', NOW(), NOW(), NOW(), NOW(), NOW(), NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.users (id, email, encrypted_password, user_metadata, raw_user_meta_data, raw_app_meta_data, created_at, updated_at, last_sign_in_at, confirmed_at, email_confirmed_at, invited_at)
VALUES
  ('00000000-0000-0000-0000-000000000002', 'cliente@keliane.adv.br', 'argon2---', '{"full_name": "Cliente Demo"}', '{"full_name": "Cliente Demo"}', '{"provider": "email", "providers": ["email"]}', NOW(), NOW(), NOW(), NOW(), NOW(), NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, full_name, email, phone, cpf, approval_status)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Administrador Keliane Machado', 'admin@keliane.adv.br', '11999999999', '12345678901', 'approved')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, full_name, email, phone, cpf, approval_status)
VALUES
  ('00000000-0000-0000-0000-000000000002', 'Cliente Demo', 'cliente@keliane.adv.br', '21888888888', '98765432109', 'approved')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
VALUES
  ('00000000-0000-0000-0000-000000000002', 'client')
ON CONFLICT (user_id, role) DO NOTHING;
