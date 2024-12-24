import React from 'react';
import { Copy } from 'lucide-react';
import type { TrackingLink } from '../../../types/tracking-link';
import { formatDate } from '../../../utils/date';

interface TrackingLinksListProps {
  links: TrackingLink[];
}

export const TrackingLinksList: React.FC<TrackingLinksListProps> = ({ links }) => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!links.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhum link de rastreamento</h2>
        <p className="text-gray-600">Clique no botão acima para criar seu primeiro link.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              URL
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cliques
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Criado em
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {links.map((link) => {
            const fullUrl = new URL(link.url);
            if (link.utm_source) fullUrl.searchParams.set('utm_source', link.utm_source);
            if (link.utm_medium) fullUrl.searchParams.set('utm_medium', link.utm_medium);
            if (link.utm_campaign) fullUrl.searchParams.set('utm_campaign', link.utm_campaign);
            if (link.utm_term) fullUrl.searchParams.set('utm_term', link.utm_term);
            if (link.utm_content) fullUrl.searchParams.set('utm_content', link.utm_content);

            return (
              <tr key={link.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {link.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                  {fullUrl.toString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {link.clicks}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(link.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => copyToClipboard(fullUrl.toString())}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};