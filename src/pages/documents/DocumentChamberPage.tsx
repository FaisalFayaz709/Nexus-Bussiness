import React, { useState } from 'react';
import { DocumentFile } from '../../types';
import { DocumentChamber } from '../../components/documents/DocumentChamber';
import { DocumentUpload } from '../../components/documents/DocumentUpload';
import { SignaturePad } from '../../components/documents/SignaturePad';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { documents as initialDocuments } from '../../data/documents';
import { signatures as initialSignatures } from '../../data/signatures';
import { X } from 'lucide-react';
import { Button } from '../../components/ui/Button';

type ModalState = 'none' | 'upload' | 'view' | 'sign';

export const DocumentChamberPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentFile[]>(initialDocuments);
  const [signatures, setSignatures] = useState(initialSignatures);
  const [modalState, setModalState] = useState<ModalState>('none');
  const [selectedDocument, setSelectedDocument] = useState<DocumentFile | null>(null);

  const handleAddDocument = () => {
    setModalState('upload');
  };

  const handleViewDocument = (doc: DocumentFile) => {
    setSelectedDocument(doc);
    setModalState('view');
  };

  const handleSignDocument = (doc: DocumentFile) => {
    setSelectedDocument(doc);
    setModalState('sign');
  };

  const handleDownloadDocument = (doc: DocumentFile) => {
    // Simulate download
    console.log('[v0] Downloading document:', doc.name);
    alert(`Downloading ${doc.name}...`);
  };

  const handleDeleteDocument = (doc: DocumentFile) => {
    if (window.confirm(`Are you sure you want to delete ${doc.name}?`)) {
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
    }
  };

  const handleShareDocument = (doc: DocumentFile) => {
    alert(`Share link copied to clipboard for ${doc.name}`);
  };

  const handleSignatureComplete = (signatureData: string) => {
    if (!selectedDocument) return;

    // Create new signature
    const newSignature = {
      id: `sig-${Date.now()}`,
      documentId: selectedDocument.id,
      signerId: 'user-1',
      signerName: 'Current User',
      signatureData,
      timestamp: new Date().toISOString(),
      status: 'signed' as const,
    };

    setSignatures((prev) => [...prev, newSignature]);

    // Update document status
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === selectedDocument.id
          ? { ...doc, status: 'signed' as const }
          : doc
      )
    );

    setModalState('none');
    setSelectedDocument(null);
    alert('Document signed successfully!');
  };

  const handleFilesSelected = (files: File[]) => {
    // Simulate adding new documents
    const newDocs = files.map((file) => ({
      id: `doc-${Date.now()}-${Math.random()}`,
      name: file.name,
      type: file.name.endsWith('.pdf') ? 'pdf' as const : 'docx' as const,
      mimeType: file.type,
      uploadedBy: 'user-1',
      uploadedByName: 'Current User',
      uploadDate: new Date().toISOString(),
      status: 'draft' as const,
      fileSize: file.size,
      currentVersion: 1,
    }));

    setDocuments((prev) => [...prev, ...newDocs]);
    setModalState('none');
    alert('Document(s) uploaded successfully!');
  };

  const pendingSignatures = signatures.filter((s) => s.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Document Chamber</h1>
          <p className="text-gray-600 mt-1">Securely manage, review, and sign your documents</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Statistics */}
          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{documents.length}</h3>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {documents.filter((d) => d.status === 'draft').length}
                </h3>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">In Review</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {documents.filter((d) => d.status === 'in_review').length}
                </h3>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Pending Signatures</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{pendingSignatures}</h3>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Document Chamber */}
        <div className="bg-white rounded-lg shadow">
          <DocumentChamber
            documents={documents}
            onViewDocument={handleViewDocument}
            onDownloadDocument={handleDownloadDocument}
            onDeleteDocument={handleDeleteDocument}
            onShareDocument={handleShareDocument}
            onSignDocument={handleSignDocument}
            onAddDocument={handleAddDocument}
          />
        </div>
      </div>

      {/* Modals */}

      {/* Upload Modal */}
      {modalState === 'upload' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Upload Documents</h2>
              <button
                onClick={() => setModalState('none')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <DocumentUpload onFilesSelected={handleFilesSelected} />
            </div>
          </div>
        </div>
      )}

      {/* View Document Modal */}
      {modalState === 'view' && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedDocument.name}</h2>
                <p className="text-sm text-gray-600 mt-1">v{selectedDocument.currentVersion}</p>
              </div>
              <button
                onClick={() => setModalState('none')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center mb-6">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-600 font-medium">{selectedDocument.type.toUpperCase()} Document Preview</p>
                  <p className="text-gray-500 text-sm mt-2">Click to view full document</p>
                </div>
              </div>
              <div className="space-y-4">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => handleDownloadDocument(selectedDocument)}
                >
                  Download Document
                </Button>
                {selectedDocument.status !== 'signed' && (
                  <Button
                    variant="success"
                    className="w-full"
                    onClick={() => {
                      setModalState('sign');
                    }}
                  >
                    Sign Document
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sign Document Modal */}
      {modalState === 'sign' && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Sign: {selectedDocument.name}</h2>
              <button
                onClick={() => setModalState('none')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <SignaturePad
                onSignatureComplete={handleSignatureComplete}
                onCancel={() => setModalState('none')}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
