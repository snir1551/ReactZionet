import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchProduct } from '../api/products';
import { Button } from 'primereact/button';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <div style={{ padding: '2rem' }}>{t('common:loading')}</div>;
  }

  if (error) {
    return <div style={{ padding: '2rem', color: 'red' }}>{t('common:error')}: {error.message}</div>;
  }

  if (!product) {
    return <div style={{ padding: '2rem' }}>{t('products:noProductFound')}</div>;
  }

  const locale = i18n.language === 'he' ? 'he-IL' : 'en-US';
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Button
        label={t('common:backToProducts')}
        icon="pi pi-arrow-left"
        onClick={() => navigate('/')}
        style={{ marginBottom: '1rem' }}
        outlined
      />

      <h1>{product.title}</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        <div>
          <img
            src={product.thumbnail}
            alt={product.title}
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </div>
        
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>{t('products:price')}:</strong> {formatter.format(product.price)}
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <strong>{t('products:brand')}:</strong> {product.brand}
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <strong>{t('products:category')}:</strong> {product.category}
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <strong>{t('products:stock')}:</strong> {product.stock}
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <strong>{t('products:rating')}:</strong> {product.rating} ⭐
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <h2>{t('products:description')}</h2>
        <p>{product.description}</p>
      </div>
    </div>
  );
}
