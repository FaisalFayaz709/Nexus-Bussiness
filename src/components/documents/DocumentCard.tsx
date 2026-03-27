import React from 'react';
import { DocumentFile } from '../../types';
import { Download, Trash2, Share2, Eye, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatDistanceToNow } from 'date-fns';

interface DocumentCardProps {
  document: DocumentFile;
  onView?: (doc: DocumentFile) => void;
  onDownload?: (doc: DocumentFile) => void;
  onDelete?: (doc: DocumentFile) => void;
  onShare?: (doc: DocumentFile) => void;
  onSign?: (doc: DocumentFile) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onView,
  onDownload,
  onDelete,
  onShare,
  onSign,
}) => {
  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    in_review: 'bg-yellow-100 text-yellow-700',
    signed: 'bg-green-100 text-green-700',
  };

  const statusLabels = {
    draft: 'Draft',
    in_review: 'In Review',
    signed: 'Signed',
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              document.type === 'pdf' ? 'bg-red-100' : 'bg-blue-100'
            }`}>
              <span className={`text-xs font-bold ${
                document.type === 'pdf' ? 'text-red-700' : 'text-blue-700'
              }`}>
                {document.type.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {document.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[document.status]}`}>
                  {statusLabels[document.status]}
                </span>
                <span className="text-xs text-gray-500">
                  v{document.currentVersion}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{formatDistanceToNow(new Date(document.uploadDate), { addSuffix: true })}</span>
          </div>
          <span>•</span>
          <span>{formatFileSize(document.fileSize)}</span>
          <span>•</span>
          <span>by {document.uploadedByName}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-2">
        {onView && (
          <button
            onClick={() => onView(document)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Eye size={16} />
            View
          </button>
        )}
        
        {onSign && document.status !== 'signed' && (
          <button
            onClick={() => onSign(document)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 border border-primary-300 rounded-lg text-sm font-medium text-primary-700 hover:bg-primary-100 transition-colors"
          >
            ✍️ Sign
          </button>
        )}

        {onDownload && (
          <button
            onClick={() => onDownload(document)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download size={16} />
            Download
          </button>
        )}

        {onShare && (
          <button
            onClick={() => onShare(document)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Share2 size={16} />
            Share
          </button>
        )}

        {onDelete && (
          <button
            onClick={() => onDelete(document)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} />
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
