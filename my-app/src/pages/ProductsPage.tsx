import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { fetchProducts, searchProducts, fetchProductsByCategory, fetchCategories } from '../api/products';
import type { Product } from '../api/types';
import './ProductsPage.css';

export const ProductsPage = () => {
  const { t, i18n } = useTranslation('products');
  const { t: tCommon } = useTranslation('common');
  const navigate = useNavigate();
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  
  // Dynamic query function based on filters - fetch all products for DataTable pagination
  const getQueryFn = () => {
    const limit = 100; // Fetch more products, DataTable will handle pagination
    const skip = 0;
    
    if (searchQuery.trim()) {
      return () => searchProducts(searchQuery.trim(), limit, skip);
    }
    if (selectedCategory) {
      return () => fetchProductsByCategory(selectedCategory, limit, skip);
    }
    return () => fetchProducts(limit, skip);
  };
  
  // Using TanStack Query with filter-aware query keys
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['products', searchQuery, selectedCategory],
    queryFn: getQueryFn(),
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
  });

  // Column templates for DataTable
  const imageBodyTemplate = (product: Product) => {
    return (
      <img 
        src={product.thumbnail} 
        alt={product.title} 
        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} 
      />
    );
  };

  const priceBodyTemplate = (product: Product) => {
    // Bonus A: Locale-aware price formatting using Intl.NumberFormat
    const locale = i18n.language === 'he' ? 'he-IL' : 'en-US';
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return <span>{formatter.format(product.price)}</span>;
  };

  const actionBodyTemplate = (product: Product) => {
    return (
      <Button 
        label={tCommon('viewDetails')}
        icon="pi pi-eye"
        onClick={() => navigate(`/products/${product.id}`)}
        className="p-button-sm"
        outlined
      />
    );
  };

  // Show loading state only for initial load
  if (isLoading && !data) {
    return (
      <div className="products-container">
        <h1>{t('catalog')}</h1>
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>{tCommon('loading')}</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="products-container">
        <h1>{t('catalog')}</h1>
        <div className="error">
          <h2>{tCommon('somethingWentWrong')}</h2>
          <p>{tCommon('error')}: {error.message}</p>
          <button onClick={() => window.location.reload()}>
            {tCommon('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  // Show products data
  return (
    <div className="products-container">
      <h1>{t('catalog')}</h1>
      
      {/* Filter Controls */}
      <form 
        onSubmit={(e) => e.preventDefault()}
        className="filters-container"
      >
        <div className="filter-group">
          <label htmlFor="search">{t('search')}</label>
          <input
            id="search"
            type="text"
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => {
              console.log('Search input changed:', e.target.value);
              setSearchQuery(e.target.value);
            }}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="category">{t('category')}:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
            }}
            className="category-select"
          >
            <option value="">{t('allCategories')}</option>
            {Array.isArray(categories) && categories?.map((category, index) => (
              <option key={category.slug || index} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Clear Filters */}
        {(searchQuery || selectedCategory) && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('');
            }}
            className="clear-filters-button"
          >
            {t('clearFilters')}
          </button>
        )}
      </form>
      
      {/* Showing count with interpolation and pluralization */}
      <p className="products-count">
        {/* INTERPOLATION: Showing {{count}} products */}
        {t('showing', { count: data?.total || 0 })}
        {' - '}
        {/* PLURALIZATION: 1 product vs 2 products */}
        {t('productCount', { count: data?.total || 0 })}
        {searchQuery && <span> {t('searchFor', { query: searchQuery })}</span>}
        {selectedCategory && <span> {t('inCategory', { category: selectedCategory })}</span>}
      </p>

      {/* TRANS COMPONENT USAGE: Embed formatting inside translation */}
      <p className="info-text" style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
        <Trans
          i18nKey="products:searchInfo"
          defaults="Use the <strong>search bar</strong> above to find products by name or <em>filter by category</em>."
          components={{ strong: <strong />, em: <em /> }}
        />
      </p>
      
      {/* PrimeReact DataTable with Sorting and Pagination */}
      <DataTable 
        value={data?.products || []}
        loading={isLoading || isFetching}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 20]}
        sortField="title"
        sortOrder={1}
        tableStyle={{ minWidth: '50rem' }}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate={`Showing {first} to {last} of {totalRecords} products`}
      >
        <Column 
          field="thumbnail" 
          header={t('image')} 
          body={imageBodyTemplate}
          style={{ width: '100px' }}
        />
        <Column 
          field="title" 
          header={t('title')} 
          sortable
          style={{ minWidth: '200px' }}
        />
        <Column 
          field="price" 
          header={t('price')} 
          body={priceBodyTemplate}
          sortable
          style={{ width: '120px' }}
        />
        <Column 
          field="category" 
          header={t('category')} 
          sortable
          style={{ width: '150px' }}
        />
        <Column 
          header={t('actions')} 
          body={actionBodyTemplate}
          style={{ width: '150px' }}
        />
      </DataTable>
    </div>
  );
};