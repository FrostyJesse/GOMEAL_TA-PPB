-- ============================================
-- GOMeal Seed Data
-- Aman dijalankan ulang (idempotent)
-- ============================================

DO $$
DECLARE
  v_cat_makanan UUID;
  v_cat_ayam UUID;
  v_cat_seafood UUID;
  v_cat_mie UUID;
  v_cat_snack UUID;
  v_cat_minuman UUID;
BEGIN
  -- Skip jika data sudah ada
  IF EXISTS (SELECT 1 FROM categories LIMIT 1) THEN
    RAISE NOTICE 'Seed data sudah ada, skip.';
    RETURN;
  END IF;

  -- ======== Insert Categories ========
  INSERT INTO categories (name, description, image_url)
    VALUES ('Makanan Berat', 'Hidangan utama yang mengenyangkan dan cocok untuk makan siang atau malam.', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop')
    RETURNING id INTO v_cat_makanan;

  INSERT INTO categories (name, description, image_url)
    VALUES ('Ayam', 'Berbagai olahan ayam dengan bumbu dan teknik masak yang beragam.', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=200&fit=crop')
    RETURNING id INTO v_cat_ayam;

  INSERT INTO categories (name, description, image_url)
    VALUES ('Seafood', 'Hidangan laut segar dengan citarasa khas nusantara.', 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=200&h=200&fit=crop')
    RETURNING id INTO v_cat_seafood;

  INSERT INTO categories (name, description, image_url)
    VALUES ('Mie', 'Berbagai jenis mie dengan kuah dan topping yang lezat.', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop')
    RETURNING id INTO v_cat_mie;

  INSERT INTO categories (name, description, image_url)
    VALUES ('Snack', 'Camilan dan makanan ringan untuk menemani waktu santai.', 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=200&h=200&fit=crop')
    RETURNING id INTO v_cat_snack;

  INSERT INTO categories (name, description, image_url)
    VALUES ('Minuman', 'Berbagai minuman segar untuk melepas dahaga.', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop')
    RETURNING id INTO v_cat_minuman;

  -- ======== Insert Menu Items (10 makanan) ========
  INSERT INTO menus (category_id, name, description, price, image_url, stock_quantity, is_available, rating, preparation_time) VALUES
    (v_cat_makanan, 'Nasi Goreng Spesial',
     'Nasi goreng dengan telur, ayam, udang, dan sayuran segar, disajikan dengan kerupuk dan acar.',
     25000, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=480&h=360&fit=crop',
     50, true, 4.8, '15 menit'),

    (v_cat_ayam, 'Ayam Geprek Sambal Matah',
     'Ayam goreng tepung yang digeprek dengan sambal matah khas Bali yang segar dan pedas.',
     22000, 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=480&h=360&fit=crop',
     45, true, 4.7, '20 menit'),

    (v_cat_mie, 'Mie Ayam Bakso',
     'Mie ayam dengan topping bakso sapi kenyal, pangsit, dan kuah kaldu gurih.',
     20000, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=480&h=360&fit=crop',
     60, true, 4.6, '15 menit'),

    (v_cat_ayam, 'Chicken Katsu',
     'Ayam fillet yang dilapisi tepung panir renyah, disajikan dengan saus katsu dan salad segar.',
     28000, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=480&h=360&fit=crop',
     40, true, 4.5, '25 menit'),

    (v_cat_makanan, 'Nasi Ayam Teriyaki',
     'Nasi putih dengan ayam panggang saus teriyaki manis gurih dan sayuran kukus.',
     27000, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=480&h=360&fit=crop',
     35, true, 4.9, '20 menit'),

    (v_cat_makanan, 'Soto Ayam',
     'Soto ayam khas Jawa dengan kuah kuning, suwiran ayam, dan pelengkap tradisional.',
     20000, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=480&h=360&fit=crop',
     55, true, 4.6, '15 menit'),

    (v_cat_makanan, 'Beef Burger',
     'Burger daging sapi premium dengan keju, selada, tomat, dan saus spesial.',
     30000, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=480&h=360&fit=crop',
     30, true, 4.4, '20 menit'),

    (v_cat_snack, 'Kentang Goreng',
     'Kentang goreng renyah dengan pilihan saus sambal, keju, atau barbeque.',
     15000, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=480&h=360&fit=crop',
     70, true, 4.3, '10 menit'),

    (v_cat_minuman, 'Es Teh Manis',
     'Teh manis segar dengan es batu, minuman pelepas dahaga yang klasik.',
     6000, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=480&h=360&fit=crop',
     100, true, 4.5, '5 menit'),

    (v_cat_minuman, 'Matcha Latte',
     'Minuman matcha premium dengan susu segar, disajikan dingin atau hangat.',
     18000, 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=480&h=360&fit=crop',
     40, true, 4.7, '10 menit');

  RAISE NOTICE 'Seed data berhasil dimasukkan!';
END $$;
