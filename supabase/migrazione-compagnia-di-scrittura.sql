-- Aggiunge il sesto sito (cds = Compagnia di Scrittura) ai media promozionali.
alter table promo_items drop constraint promo_items_site_key_check,
  add constraint promo_items_site_key_check check (site_key in ('seo','soft','lib','com','boost','cds'));
