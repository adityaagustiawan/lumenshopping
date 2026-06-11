-- Add new categories to the categories table
INSERT INTO categories (slug, name, icon, sort_order) VALUES
  ('toys', 'Toys & Games', '🧸', 7),
  ('food', 'Food & Beverages', '🍕', 8),
  ('automotive', 'Automotive', '🚗', 9),
  ('pets', 'Pet Supplies', '🐾', 10)
ON CONFLICT (slug) DO NOTHING;

-- Made with Bob
