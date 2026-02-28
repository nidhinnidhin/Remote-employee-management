"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Download,
  Trash2,
  FileText,
  Upload,
  X,
  FileSpreadsheet,
  File,
  AlertTriangle,
  Pencil,
} from "lucide-react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import FormDropdown from "@/components/ui/FormDropdown";
import {
  uploadDocument,
  deleteDocument,
  editDocument,
  fetchProfile,
} from "@/services/employee/profile/documents.service";

interface Document {
  _id: string;
  name: string;
  category: string;
  fileUrl: string;
  publicId: string;
  resourceType: "image" | "raw" | "video";
  uploadedAt: string;
  size?: string;
}

const CATEGORY_OPTIONS = [
  "ID Proofs",
  "Certificates",
  "Resumes",
  "Offer Letters",
  "Education",
  "Other",
];

/* ─── helpers ─────────────────────────────────────────────────────────── */

const getFileExtension = (url: string): string => {
  const clean = url.split("?")[0].split("/").pop() ?? "";
  return clean.split(".").pop()?.toLowerCase() ?? "";
};

const isImageExt = (ext: string) =>
  ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext);

const isPdfExt = (ext: string) => ext === "pdf";

const isSpreadsheetExt = (ext: string) =>
  ["xls", "xlsx", "csv"].includes(ext);

const FILE_TYPE_STYLES: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  pdf:  { bg: "bg-red-100",    text: "text-red-600",    label: "PDF"  },
  jpg:  { bg: "bg-blue-100",   text: "text-blue-600",   label: "JPG"  },
  jpeg: { bg: "bg-blue-100",   text: "text-blue-600",   label: "JPEG" },
  png:  { bg: "bg-blue-100",   text: "text-blue-600",   label: "PNG"  },
  gif:  { bg: "bg-purple-100", text: "text-purple-600", label: "GIF"  },
  webp: { bg: "bg-blue-100",   text: "text-blue-600",   label: "WEBP" },
  doc:  { bg: "bg-sky-100",    text: "text-sky-600",    label: "DOC"  },
  docx: { bg: "bg-sky-100",    text: "text-sky-600",    label: "DOCX" },
  xls:  { bg: "bg-green-100",  text: "text-green-600",  label: "XLS"  },
  xlsx: { bg: "bg-green-100",  text: "text-green-600",  label: "XLSX" },
  csv:  { bg: "bg-green-100",  text: "text-green-600",  label: "CSV"  },
};

/* ─── FilePreview ──────────────────────────────────────────────────────── */

const FilePreview: React.FC<{ url: string; name: string }> = ({ url, name }) => {
  const ext = getFileExtension(url);

  if (isImageExt(ext)) {
    return (
      <div className="w-full h-28 rounded-lg overflow-hidden bg-[rgb(var(--color-bg-subtle))] relative">
        <img
          src={url}
          alt={name}
          className="w-full h-full object-cover blur-[2px] scale-105 brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </div>
    );
  }

  const style = FILE_TYPE_STYLES[ext] ?? {
    bg: "bg-gray-100",
    text: "text-gray-500",
    label: ext.toUpperCase() || "FILE",
  };

  const Icon = isPdfExt(ext)
    ? FileText
    : isSpreadsheetExt(ext)
      ? FileSpreadsheet
      : ["doc", "docx"].includes(ext)
        ? FileText
        : File;

  return (
    <div className={`w-full h-28 rounded-lg flex flex-col items-center justify-center gap-2 ${style.bg}`}>
      <Icon className={`w-8 h-8 ${style.text}`} />
      <span className={`text-xs font-bold tracking-wide ${style.text}`}>
        {style.label}
      </span>
    </div>
  );
};

/* ─── Download helper ──────────────────────────────────────────────────── */

const handleDownload = async (url: string, name: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(url, "_blank");
  }
};

/* ─── DocumentCard ─────────────────────────────────────────────────────── */

const DocumentCard: React.FC<{
  doc: Document;
  onEditRequest: (doc: Document) => void;
  onDeleteRequest: (doc: Document) => void;
}> = ({ doc, onEditRequest, onDeleteRequest }) => {
  const ext = getFileExtension(doc.fileUrl);
  const badge = FILE_TYPE_STYLES[ext];

  return (
    <div className="portal-card p-5 flex flex-col gap-3">
      <FilePreview url={doc.fileUrl} name={doc.name} />

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-primary truncate">{doc.name}</p>
          <p className="text-xs font-bold text-accent mt-0.5">{doc.category}</p>
        </div>
        {badge && (
          <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
            {badge.label}
          </span>
        )}
      </div>

      <p className="text-xs text-muted">
        {doc.size ? `${doc.size} • ` : ""}
        {new Date(doc.uploadedAt).toISOString().split("T")[0]}
      </p>

      {/* Actions: Download | Edit | Delete */}
      <div className="flex items-center gap-2">
        <button
          className="flex-1 flex items-center justify-center gap-2 py-2 border rounded-lg text-sm font-medium text-secondary hover:bg-[rgb(var(--color-bg-subtle))] transition"
          style={{ borderColor: "rgb(var(--color-border))" }}
          onClick={() => handleDownload(doc.fileUrl, doc.name)}
        >
          <Download className="w-4 h-4" />
          Download
        </button>

        <button
          onClick={() => onEditRequest(doc)}
          className="w-9 h-9 flex items-center justify-center border rounded-lg text-secondary hover:bg-[rgb(var(--color-bg-subtle))] transition flex-shrink-0"
          style={{ borderColor: "rgb(var(--color-border))" }}
          aria-label="Edit document"
        >
          <Pencil className="w-4 h-4" />
        </button>

        <button
          onClick={() => onDeleteRequest(doc)}
          className="w-9 h-9 flex items-center justify-center bg-danger hover:opacity-90 transition rounded-lg text-white flex-shrink-0"
          aria-label="Delete document"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/* ─── DeleteConfirmModal ───────────────────────────────────────────────── */

const DeleteConfirmModal: React.FC<{
  isOpen: boolean;
  docName: string;
  deleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isOpen, docName, deleting, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !deleting && onCancel()}
      />
      <div className="relative z-10 portal-card p-6 w-full max-w-sm flex flex-col gap-5 shadow-xl">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <div className="text-center flex flex-col gap-1.5">
          <p className="text-sm font-bold text-primary">Delete Document?</p>
          <p className="text-xs text-muted leading-relaxed">
            <span className="font-semibold text-secondary">"{docName}"</span>{" "}
            will be permanently deleted and cannot be recovered.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={onCancel}
            className="flex-1 rounded-lg"
            disabled={deleting}
          >
            Cancel
          </Button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-2 px-4 rounded-lg text-sm font-semibold bg-danger text-white hover:opacity-90 transition disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── DocumentVault ────────────────────────────────────────────────────── */

const DocumentVault: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);

  // Upload modal
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

  // Edit modal
  const [editTarget, setEditTarget] = useState<Document | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [editFieldErrors, setEditFieldErrors] = useState<{
    editName?: string;
    editCategory?: string;
  }>({});
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Document | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await fetchProfile();
        setDocuments(profile.documents || []);
      } catch {
        console.error("Failed to fetch documents");
      }
    };
    load();
  }, []);

  /* ── Upload ── */

  const resetForm = () => {
    setDocName("");
    setDocCategory("");
    setDocFile(null);
    setSaveError("");
    setFieldErrors({});
  };

  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
    resetForm();
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setDocFile(file);
    if (!docName) setDocName(file.name.replace(/\.[^/.]+$/, ""));
    setFieldErrors((prev) => ({ ...prev, docFile: undefined }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const validateUpload = () => {
    const errors: typeof fieldErrors = {};
    if (!docName.trim()) errors.docName = "Document name is required.";
    if (!docCategory) errors.docCategory = "Please select a category.";
    if (!docFile) errors.docFile = "Please select a file to upload.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateUpload()) return;
    setSaving(true);
    setSaveError("");
    try {
      await uploadDocument(docFile!, docName, docCategory);
      const profile = await fetchProfile();
      setDocuments(profile.documents || []);
      handleCloseUploadModal();
    } catch (err: any) {
      setSaveError(
        err.response?.data?.message ||
          "Failed to upload document. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* ── Edit ── */

  const handleEditRequest = (doc: Document) => {
    setEditTarget(doc);
    setEditName(doc.name);
    setEditCategory(doc.category);
    setEditFile(null);
    setEditError("");
    setEditFieldErrors({});
  };

  const handleCloseEditModal = () => {
    setEditTarget(null);
    setEditName("");
    setEditCategory("");
    setEditFile(null);
    setEditError("");
    setEditFieldErrors({});
  };

  const validateEdit = () => {
    const errors: typeof editFieldErrors = {};
    if (!editName.trim()) errors.editName = "Document name is required.";
    if (!editCategory) errors.editCategory = "Please select a category.";
    setEditFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditSave = async () => {
    if (!editTarget || !validateEdit()) return;
    setEditSaving(true);
    setEditError("");
    try {
      await editDocument(editTarget._id, editName, editCategory, editFile ?? undefined);

      if (editFile) {
        // File changed — refetch to get new fileUrl, publicId, resourceType
        const profile = await fetchProfile();
        setDocuments(profile.documents || []);
      } else {
        // Only name/category changed — optimistic update
        setDocuments((prev) =>
          prev.map((d) =>
            d._id === editTarget._id
              ? { ...d, name: editName, category: editCategory }
              : d,
          ),
        );
      }
      handleCloseEditModal();
    } catch (err: any) {
      setEditError(
        err.response?.data?.message || "Failed to update document. Please try again.",
      );
    } finally {
      setEditSaving(false);
    }
  };

  /* ── Delete ── */

  const handleDeleteRequest = (doc: Document) => {
    setDeleteTarget(doc);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDocument(
        deleteTarget._id,
        deleteTarget.publicId,
        deleteTarget.resourceType,
      );
      setDocuments((prev) => prev.filter((d) => d._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err: any) {
      console.error("Delete failed:", err.response?.data || err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    if (!deleting) setDeleteTarget(null);
  };

  /* ── Render ── */

  return (
    <div className="flex flex-col gap-5">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        docName={deleteTarget?.name ?? ""}
        deleting={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

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
          <p className="text-sm font-semibold text-primary">No documents yet</p>
          <p className="text-xs text-muted">
            Upload your first document to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.publicId}
              doc={doc}
              onEditRequest={handleEditRequest}
              onDeleteRequest={handleDeleteRequest}
            />
          ))}
        </div>
      )}

      {/* ── Upload Modal ── */}
      <BaseModal
        isOpen={uploadModalOpen}
        onClose={handleCloseUploadModal}
        title="Upload Document"
        description="Add a new document to your vault."
        footer={
          <div className="flex flex-col gap-3">
            {saveError && (
              <p className="text-sm text-danger text-center">{saveError}</p>
            )}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleCloseUploadModal}
                className="flex-1 rounded-lg"
              >
                Cancel
              </Button>
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

          <div className="flex flex-col gap-1.5">
            <label className="block text-sm font-medium text-secondary mb-1">
              File <span className="text-danger">*</span>
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer transition ${
                dragOver
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
                  <p className="text-sm font-medium text-primary">{docFile.name}</p>
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

      {/* ── Edit Modal ── */}
      <BaseModal
        isOpen={!!editTarget}
        onClose={handleCloseEditModal}
        title="Edit Document"
        description="Update the document name, category, or replace the file."
        footer={
          <div className="flex flex-col gap-3">
            {editError && (
              <p className="text-sm text-danger text-center">{editError}</p>
            )}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleCloseEditModal}
                className="flex-1 rounded-lg"
                disabled={editSaving}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleEditSave}
                disabled={editSaving}
                className="flex-1 rounded-lg"
              >
                {editSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        }
      >
        <div className="flex flex-col">
          <FormInput
            label="Document Name"
            name="editName"
            type="text"
            value={editName}
            onChange={(e) => {
              setEditName(e.target.value);
              setEditFieldErrors((prev) => ({ ...prev, editName: undefined }));
            }}
            placeholder="e.g. Employment Contract"
            error={editFieldErrors.editName}
            required
            icon={<FileText size={16} />}
          />

          <FormDropdown
            label="Category"
            name="editCategory"
            value={editCategory}
            onChange={(
              e:
                | React.ChangeEvent<HTMLSelectElement>
                | { target: { name: string; value: string } },
            ) => {
              setEditCategory(e.target.value);
              setEditFieldErrors((prev) => ({ ...prev, editCategory: undefined }));
            }}
            options={CATEGORY_OPTIONS}
            placeholder="Select a category"
            error={editFieldErrors.editCategory}
            required
          />

          {/* ── Optional file replacement ── */}
          <div className="flex flex-col gap-1.5 mt-1">
            <label className="block text-sm font-medium text-secondary">
              Replace File{" "}
              <span className="text-xs text-muted font-normal">(optional)</span>
            </label>

            {editFile ? (
              /* Selected new file — show name + remove */
              <div
                className="flex items-center justify-between px-3 py-2.5 border rounded-lg"
                style={{ borderColor: "rgb(var(--color-border))" }}
              >
                <div className="min-w-0 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-accent flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-primary truncate">
                      {editFile.name}
                    </p>
                    <p className="text-xs text-muted">
                      {editFile.size > 1024 * 1024
                        ? `${(editFile.size / (1024 * 1024)).toFixed(1)} MB`
                        : `${Math.round(editFile.size / 1024)} KB`}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditFile(null)}
                  className="ml-2 text-muted hover:text-danger transition flex-shrink-0"
                  aria-label="Remove selected file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* No file selected — show pick button */
              <button
                type="button"
                onClick={() => editFileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2.5 border border-dashed rounded-lg text-sm text-secondary hover:border-[rgb(var(--color-accent))] hover:text-accent transition"
                style={{ borderColor: "rgb(var(--color-border))" }}
              >
                <Upload className="w-4 h-4" />
                Choose new file to replace
              </button>
            )}

            <input
              ref={editFileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => setEditFile(e.target.files?.[0] ?? null)}
            />

            {/* Current file hint */}
            {!editFile && editTarget && (
              <p className="text-xs text-muted">
                Current:{" "}
                <span className="font-medium text-secondary">
                  {getFileExtension(editTarget.fileUrl).toUpperCase()} file
                </span>{" "}
                — leave empty to keep it.
              </p>
            )}
          </div>
        </div>
      </BaseModal>
    </div>
  );
};

export default DocumentVault;