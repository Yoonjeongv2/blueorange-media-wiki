'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ProductData {
  [key: string]: string;
}

export default function Products() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await fetch('/api/sheets?sheet=상품소개서');
      const result = await response.json();
      setProducts(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-4xl px-6">
          <Link
            href="/"
            className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            ← 돌아가기
          </Link>
          <h1 className="text-4xl font-light tracking-tight text-gray-900">
            매체 상품소개서
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            매체별 기본 상품 정보 및 타깃별 소개서
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        {loading ? (
          <div className="py-12 text-center text-gray-600">로드 중...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {products.length > 0 ? (
              products.map((product, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow"
                >
                  <h3 className="text-lg font-medium text-gray-900">
                    {product['매체'] || product['Platform'] || '매체명'}
                  </h3>
                  <div className="mt-4 space-y-2 text-sm">
                    <p>
                      <span className="text-gray-600">상품명: </span>
                      <span className="font-medium">{product['상품명'] || '-'}</span>
                    </p>
                    <p>
                      <span className="text-gray-600">설명: </span>
                      <span>{product['설명'] || '-'}</span>
                    </p>
                    <p>
                      <span className="text-gray-600">타깃: </span>
                      <span>{product['타깃'] || '-'}</span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-600">
                아직 등록된 상품이 없습니다.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
