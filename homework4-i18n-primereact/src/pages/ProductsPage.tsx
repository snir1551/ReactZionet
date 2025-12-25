import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../api/products';
import type { Product } from '../api/types';
import styles from './ProductsPage.module.css';

export function ProductsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return <div className={styles.productsPage}>{t('common:loading')}</div>;
  }

  if (error) {
    return <div className={styles.productsPage} style={{ color: 'red' }}>{t('common:error')}: {error.message}</div>;
  }

  const imageBodyTemplate = (product: Product) => {
    return (
      <img
        src={product.thumbnail}
        alt={product.title}
        className={styles.productImage}
      />
    );
  };

  const priceBodyTemplate = (product: Product) => {
    const locale = i18n.language === 'he' ? 'he-IL' : 'en-US';
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return <span style={{ fontWeight: 600, color: '#059669' }}>{formatter.format(product.price)}</span>;
  };

  const actionsBodyTemplate = (product: Product) => {
    return (
      <Button
        label={t('products:viewDetails')}
        icon="pi pi-eye"
        onClick={() => navigate(`/products/${product.id}`)}
        size="small"
        severity="info"
      />
    );
  };

  return (
    <div className={styles.productsPage}>
      <div className={styles.header}>
        <h1>{t('common:products')}</h1>
        <p>{t('products:showing', { count: data?.products.length || 0 })}</p>
      </div>
      
      <DataTable
        value={data?.products}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 20]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="{first} - {last} of {totalRecords}"
        stripedRows
      >
        <Column
          header={t('products:image')}
          body={imageBodyTemplate}
          style={{ width: '120px' }}
        />
        <Column
          field="title"
          header={t('products:title')}
          sortable
          style={{ fontWeight: 500 }}
        />
        <Column
          field="price"
          header={t('products:price')}
          body={priceBodyTemplate}
          sortable
          style={{ width: '150px' }}
        />
        <Column
          field="category"
          header={t('products:category')}
          sortable
          style={{ width: '200px' }}
        />
        <Column
          header={t('products:actions')}
          body={actionsBodyTemplate}
          style={{ width: '180px', textAlign: 'center' }}
        />
      </DataTable>
    </div>
  );
}
