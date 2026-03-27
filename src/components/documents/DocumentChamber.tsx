import React, { useState } from 'react';
import { DocumentFile } from '../../types';
import { Search, Filter, Plus, LayoutGrid, List } from 'lucide-react';
import { DocumentCard } from './DocumentCard';
import { Button } from '../ui/Button';

interface DocumentChamberProps {
  documents: DocumentFile[];
  onViewDocument?: (doc: DocumentFile) => void;
  onDownloadDocument?: (doc: DocumentFile) => void;
  onDeleteDocument?: (doc: DocumentFile) => void;
  onShareDocument?: (doc: DocumentFile) => void;
  onSignDocument?: (doc: DocumentFile) => void;
  onAddDocument?: () => void;
}

export const DocumentChamber: React.FC<DocumentChamberProps> = ({
  documents,
  onViewDocument,
  onDownloadDocument,
  onDeleteDocument,
  onShareDocument,
  onSignDocument,
  onAddDocument,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'draft' | 'in_review' | 'signed'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Count by status
  const statusCounts = {
    all: documents.length,
    draft: documents.filter((d) => d.status === 'draft').length,
    in_review: documents.filter((d) => d.status === 'in_review').length,
    signed: documents.filter((d) => d.status === 'signed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Chamber</h1>
          <p className="text-gray-600 mt-1">Manage all your important documents and signatures</p>
        </div>
        {onAddDocument && (
          <Button variant="primary" onClick={onAddDocument}>
            <Plus size={20} className="mr-2" />
            Upload Document
          </Button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex gap-2">
          {/* View Mode Toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'draft', 'in_review', 'signed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
              selectedStatus === status
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="capitalize">
              {status === 'in_review' ? 'In Review' : status}
            </span>
            <span className="text-sm opacity-75">
              ({statusCounts[status]})
            </span>
          </button>
        ))}
      </div>

      {/* Documents Grid/List */}
      {filteredDocuments.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }>
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onView={onViewDocument}
              onDownload={onDownloadDocument}
              onDelete={onDeleteDocument}
              onShare={onShareDocument}
              onSign={onSignDocument}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No documents found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedStatus !== 'all'
              ? 'Try adjusting your search or filter'
              : 'Get started by uploading your first document'}
          </p>
          {onAddDocument && (
            <Button variant="primary" onClick={onAddDocument}>
              <Plus size={18} className="mr-2" />
              Upload Your First Document
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
