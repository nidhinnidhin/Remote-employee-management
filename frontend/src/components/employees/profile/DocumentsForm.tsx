"use client";

import React, { useState, useRef } from "react";
import { Plus, Download, Trash2, FileText, Upload, X } from "lucide-react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import FormDropdown from "@/components/ui/FormDropdown";

interface Document {
  id: string;
  name: string;
  category: string;
  size: string;
  date: string;
  url?: string;
}

const CATEGORY_OPTIONS = [
  "ID Proofs",
  "Certificates",
  "Resumes",
  "Offer Letters",
  "Education",
  "Other",
];

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Employment Contract.pdf",
    category: "ID Proofs",
    size: "2.4 MB",
    date: "2020-03-15",
  },
  {
    id: "2",
    name: "AWS Certification.pdf",
    category: "Certificates",
    size: "1.8 MB",
    date: "2023-08-20",
  },
  {
    id: "3",
    name: "Resume_JohnDoe_2024.pdf",
    category: "Resumes",
    size: "856 KB",
    date: "2024-01-10",
  },
  {
    id: "4",
    name: "Passport_Copy.pdf",
    category: "ID Proofs",
    size: "3.2 MB",
    date: "2020-03-15",
  },
];

const DocumentCard: React.FC<{
  doc: Document;
  onDelete: (id: string) => void;
}> = ({ doc, onDelete }) => (
  <div className="portal-card p-5 flex flex-col gap-4">
    <div className="flex items-start gap-3">
      <div className="section-icon-wrap">
        <FileText className="section-icon" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-primary truncate">
          {doc.name}
        </p>
        <p className="text-xs font-bold text-accent mt-0.5">
          {doc.category}
        </p>
      </div>
    </div>

    <p className="text-xs text-muted">
      {doc.size} • {doc.date}
    </p>

    <div className="flex items-center gap-2">
      <button
        className="flex-1 flex items-center justify-center gap-2 py-2 border rounded-lg text-sm font-medium text-secondary hover:bg-[rgb(var(--color-bg-subtle))] transition"
        style={{ borderColor: "rgb(var(--color-border))" }}
        onClick={() => doc.url && window.open(doc.url, "_blank")}
      >
        <Download className="w-4 h-4" />
        Download
      </button>
      <button
        onClick={() => onDelete(doc.id)}
        className="w-9 h-9 flex items-center justify-center bg-danger hover:opacity-90 transition rounded-lg text-white flex-shrink-0"
        aria-label="Delete document"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const DocumentVault: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    docName?: string;
    docCategory?: string;
    docFile?: string;
  }>({});

  const [docName, setDocName] = useState("");
  const [docCategory, setDocCategory] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setDocName("");
    setDocCategory("");
    setDocFile(null);
    setSaveError("");
    setFieldErrors({});
  };

  const handleCloseModal = () => {
    setUploadModalOpen(false);
    resetForm();
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setDocFile(file);
    if (!docName) setDocName(file.name);
    setFieldErrors((prev) => ({ ...prev, docFile: undefined }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const validate = () => {
    const errors: typeof fieldErrors = {};
    if (!docName.trim()) errors.docName = "Document name is required.";
    if (!docCategory) errors.docCategory = "Please select a category.";
    if (!docFile) errors.docFile = "Please select a file to upload.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setSaveError("");
    try {
      // Replace with your actual API call:
      // const form = new FormData();
      // form.append("file", docFile!);
      // form.append("name", docName);
      // form.append("category", docCategory);
      // await clientApi.post("/documents", form);
      await new Promise((res) => setTimeout(res, 900));

      const newDoc: Document = {
        id: Date.now().toString(),
        name: docName,
        category: docCategory,
        size:
          docFile!.size > 1024 * 1024
            ? `${(docFile!.size / (1024 * 1024)).toFixed(1)} MB`
            : `${Math.round(docFile!.size / 1024)} KB`,
        date: new Date().toISOString().split("T")[0],
      };
      setDocuments((prev) => [...prev, newDoc]);
      handleCloseModal();
    } catch {
      setSaveError("Failed to upload document. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-primary">Document Vault</h2>
        <Button
          variant="primary"
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center gap-2 rounded-xl text-sm"
        >
          <Plus className="w-4 h-4" />
          Upload Document
        </Button>
      </div>

      {/* Document Grid */}
      {documents.length === 0 ? (
        <div className="portal-card p-12 flex flex-col items-center gap-3 text-center">
          <div className="section-icon-wrap w-12 h-12">
            <FileText className="section-icon w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-primary">
            No documents yet
          </p>
          <p className="text-xs text-muted">
            Upload your first document to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Upload Modal — uses your BaseModal */}
      <BaseModal
        isOpen={uploadModalOpen}
        onClose={handleCloseModal}
        title="Upload Document"
        description="Add a new document to your vault."
        footer={
          <div className="flex flex-col gap-3">
            {saveError && (
              <p className="text-sm text-danger text-center">{saveError}</p>
            )}
            <div className="flex gap-3">
              {/* Uses your Button component — secondary variant */}
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                className="flex-1 rounded-lg"
              >
                Cancel
              </Button>
              {/* Uses your Button component — primary variant */}
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-lg"
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        }
      >
        <div className="flex flex-col">
          {/* Uses your FormInput component */}
          <FormInput
            label="Document Name"
            name="docName"
            type="text"
            value={docName}
            onChange={(e) => {
              setDocName(e.target.value);
              setFieldErrors((prev) => ({ ...prev, docName: undefined }));
            }}
            placeholder="e.g. Employment Contract"
            error={fieldErrors.docName}
            required
            icon={<FileText size={16} />}
          />

          {/* Uses your FormDropdown component */}
          <FormDropdown
            label="Category"
            name="docCategory"
            value={docCategory}
            onChange={(
              e:
                | React.ChangeEvent<HTMLSelectElement>
                | { target: { name: string; value: string } },
            ) => {
              setDocCategory(e.target.value);
              setFieldErrors((prev) => ({ ...prev, docCategory: undefined }));
            }}
            options={CATEGORY_OPTIONS}
            placeholder="Select a category"
            error={fieldErrors.docCategory}
            required
          />

          {/* File upload — custom drag-and-drop matching active theme */}
          <div className="flex flex-col gap-1.5">
            <label className="block text-sm font-medium text-secondary mb-1">
              File <span className="text-danger">*</span>
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer transition ${dragOver
                  ? "border-[rgb(var(--color-accent))] bg-[rgb(var(--color-accent-subtle))]"
                  : fieldErrors.docFile
                    ? "border-danger"
                    : "border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-bg-subtle))]"
                }`}
            >
              <div className="section-icon-wrap w-10 h-10">
                <Upload className="section-icon w-5 h-5" />
              </div>
              {docFile ? (
                <div className="text-center">
                  <p className="text-sm font-medium text-primary">
                    {docFile.name}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {docFile.size > 1024 * 1024
                      ? `${(docFile.size / (1024 * 1024)).toFixed(1)} MB`
                      : `${Math.round(docFile.size / 1024)} KB`}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-secondary">
                    Drag & drop or{" "}
                    <span className="text-accent font-medium">browse</span>
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    PDF, DOC, DOCX, JPG, PNG up to 10MB
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              />
            </div>
            {fieldErrors.docFile && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.docFile}</p>
            )}
            {docFile && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDocFile(null);
                  setDocName("");
                }}
                className="self-end flex items-center gap-1 text-xs text-muted hover:text-danger transition mt-1"
              >
                <X className="w-3 h-3" /> Remove file
              </button>
            )}
          </div>
        </div>
      </BaseModal>
    </div>
  );
};

export default DocumentVault;
