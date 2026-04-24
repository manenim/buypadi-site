'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar';
import { api, type SubmitRequestPayload } from '@/app/lib/api';

const inputClass =
  'w-full bg-surface-alt border border-transparent rounded-xl px-4 py-3 text-sm text-heading placeholder:text-subtle focus:outline-none focus:border-lime focus:bg-white transition-colors';

function SectionHeader({ step, title, subtitle }: { step: number; title: string; subtitle: string }) {
  return (
    <div className="mb-6 flex items-start gap-4 border-b border-surface-alt pb-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime font-display text-sm font-black text-white">
        {step}
      </div>
      <div>
        <h2 className="font-display text-lg font-bold text-heading">{title}</h2>
        <p className="mt-0.5 text-sm text-muted">{subtitle}</p>
      </div>
    </div>
  );
}

function Label({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-copy">
      {children}
      {optional && <span className="text-xs font-normal text-subtle">(optional)</span>}
    </label>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      title="Copy to clipboard"
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-surface-alt bg-surface transition-colors hover:border-primary/20 hover:bg-white"
    >
      {copied ? (
        <svg className="h-4 w-4 text-lime-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      ) : (
        <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.375" />
        </svg>
      )}
    </button>
  );
}

export default function RequestPage() {
  // Form fields
  const [productLink, setProductLink] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [comments, setComments] = useState('');
  const [buyerFullName, setBuyerFullName] = useState('');
  const [buyerWhatsapp, setBuyerWhatsapp] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerAddress, setSellerAddress] = useState('');

  // File upload state — upload happens immediately on file select
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  async function startUpload(file: File) {
    setSelectedFile(file);
    setUploadedUrl(null);
    setUploadError(null);
    setUploadProgress(0);
    setIsUploading(true);
    setPreviewUrl(file.type.startsWith('image/') ? URL.createObjectURL(file) : null);

    // Simulate progress 0 → 80% while the request is in flight
    let progress = 0;
    const interval = setInterval(() => {
      progress = Math.min(progress + 12, 80);
      setUploadProgress(progress);
    }, 350);

    try {
      const result = await api.uploadFile(file);
      clearInterval(interval);
      setUploadProgress(100);
      setUploadedUrl(result.url);
    } catch (err: any) {
      clearInterval(interval);
      setUploadProgress(0);
      setUploadError(err.message ?? 'Upload failed. Try another image.');
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileSelect(file: File) {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      setUploadError('Only PNG and JPG images are supported.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File too large. Maximum size is 15 MB.');
      return;
    }
    startUpload(file);
  }

  function handleRemoveFile() {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadedUrl(null);
    setUploadProgress(0);
    setUploadError(null);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const price = parseFloat(itemPrice);
    if (!buyerFullName.trim() || !buyerWhatsapp.trim() || !buyerEmail.trim() ||
      !sellerName.trim() || !sellerPhone.trim() || !sellerAddress.trim() || isNaN(price) || price <= 0) {
      setSubmitError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: SubmitRequestPayload = {
        productLink: productLink.trim() || undefined,
        itemPrice: price,
        comments: comments.trim() || undefined,
        screenshotUrl: uploadedUrl ?? undefined,
        buyerFullName: buyerFullName.trim(),
        buyerWhatsapp: buyerWhatsapp.trim(),
        buyerEmail: buyerEmail.trim(),
        sellerName: sellerName.trim(),
        sellerPhone: sellerPhone.trim(),
        sellerAddress: sellerAddress.trim(),
      };
      const res = await api.submitRequest(payload);
      setOrderId(res.orderId);
    } catch (err: any) {
      setSubmitError(err.message ?? 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────

  if (orderId) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
          <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-lime/15">
              <svg className="h-10 w-10 text-lime-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h1 className="font-display text-3xl font-black text-heading">Request submitted!</h1>
              <p className="text-sm leading-relaxed text-copy">
                Your inspection request is in. We'll reach out via WhatsApp or email with next steps.
              </p>
            </div>
            <div className="w-full rounded-2xl border border-surface-alt bg-white px-5 py-4 text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Your Order ID</p>
              <div className="mt-1 flex items-center gap-3">
                <p className="flex-1 font-display text-2xl font-black text-primary">{orderId}</p>
                <CopyButton text={orderId} />
              </div>
              <p className="mt-1 text-xs text-muted">Save this to track your order.</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <Link href={`/track?orderid=${orderId}`}
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-primary font-semibold text-white transition-colors hover:bg-primary/90">
                Track your order
              </Link>
              <Link href="/"
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full border border-surface-alt text-sm font-semibold text-copy transition-colors hover:border-primary/20 hover:text-primary">
                Back to home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Submit is blocked while upload is in progress (not while submitting form)
  const submitBlocked = isUploading;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-12 lg:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 lg:mb-10">
            <h1 className="font-display text-3xl font-black leading-tight text-heading lg:text-[40px]">
              Request Inspection
            </h1>
            <p className="mt-2 max-w-lg text-base leading-relaxed text-copy">
              Book a professional physical inspection before you buy. We verify what you see is what you get.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Section 1: Item Information */}
            <div className="rounded-[1.875rem] bg-white px-6 py-8 sm:px-8">
              <SectionHeader step={1} title="Item Information" subtitle="Tell us about the item you want inspected." />
              <div className="flex flex-col gap-5">
                <div>
                  <Label optional>Product Link</Label>
                  <input type="url" value={productLink} onChange={(e) => setProductLink(e.target.value)}
                    placeholder="Paste link (e.g. Jiji, Facebook, Instagram)" className={inputClass} />
                </div>
                <div>
                  <Label>Item Price (₦)</Label>
                  <input type="number" required value={itemPrice} onChange={(e) => setItemPrice(e.target.value)}
                    placeholder="Enter amount" min="1" className={inputClass} />
                </div>
                <div>
                  <Label optional>Comments</Label>
                  <textarea rows={3} value={comments} onChange={(e) => setComments(e.target.value)}
                    placeholder="Specific things you want us to check…" className={`${inputClass} resize-none`} />
                </div>

                {/* File upload — instant upload on select */}
                <div>
                  <Label optional>Screenshot</Label>

                  {selectedFile ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-4 rounded-xl border border-surface-alt bg-surface-alt p-4">
                        {previewUrl ? (
                          <img src={previewUrl} alt="preview" className="h-16 w-16 rounded-lg object-cover" />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white">
                            <svg className="h-7 w-7 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-heading">{selectedFile.name}</p>
                          <p className="text-xs text-muted">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        {!isUploading && (
                          <button type="button" onClick={handleRemoveFile}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-surface-alt bg-white text-muted transition-colors hover:border-red-200 hover:text-red-500">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Progress bar / status */}
                      {isUploading && (
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-xs text-muted">
                            <span>Uploading…</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-alt">
                            <div
                              className="h-full rounded-full bg-lime transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {!isUploading && uploadedUrl && (
                        <div className="flex items-center gap-2 text-xs text-lime-dark">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          Image uploaded successfully
                        </div>
                      )}
                      {uploadError && (
                        <div className="flex items-center gap-2 text-xs text-red-500">
                          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                          </svg>
                          {uploadError}
                          <button type="button" onClick={handleRemoveFile} className="font-semibold underline">
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      className={`flex w-full cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                        isDragging ? 'border-lime bg-lime/5' : 'border-subtle/40 bg-surface-alt hover:border-lime'
                      }`}
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                        <svg className="h-5 w-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-heading">
                          Drag & drop or{' '}
                          <span className="text-lime underline underline-offset-2">click to upload</span>
                        </p>
                        <p className="mt-0.5 text-xs text-muted">PNG, JPG up to 15 MB</p>
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg"
                        className="sr-only"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Buyer Information */}
            <div className="rounded-[1.875rem] bg-white px-6 py-8 sm:px-8">
              <SectionHeader step={2} title="Buyer Information" subtitle="Your contact details for inspection reports." />
              <div className="flex flex-col gap-5">
                <div>
                  <Label>Full Name</Label>
                  <input type="text" required value={buyerFullName} onChange={(e) => setBuyerFullName(e.target.value)}
                    placeholder="Emeka Johnson" className={inputClass} />
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <Label>WhatsApp Number</Label>
                    <div className="flex gap-2">
                      <span className="flex shrink-0 items-center gap-1.5 rounded-xl border border-transparent bg-surface-alt px-3 py-3 text-sm font-medium text-copy">
                        🇳🇬 <span className="text-muted">+234</span>
                      </span>
                      <input type="tel" required value={buyerWhatsapp} onChange={(e) => setBuyerWhatsapp(e.target.value)}
                        placeholder="8012345678" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <Label>Email Address</Label>
                    <input type="email" required value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="you@example.com" className={inputClass} />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Seller Information */}
            <div className="rounded-[1.875rem] bg-white px-6 py-8 sm:px-8">
              <SectionHeader step={3} title="Seller Information" subtitle="Who to send our inspector to." />
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <Label>Seller Name / Store</Label>
                    <input type="text" required value={sellerName} onChange={(e) => setSellerName(e.target.value)}
                      placeholder="e.g. Tunde Motors, Lagos" className={inputClass} />
                  </div>
                  <div>
                    <Label>Seller Phone</Label>
                    <input type="tel" required value={sellerPhone} onChange={(e) => setSellerPhone(e.target.value)}
                      placeholder="Seller's phone number" className={inputClass} />
                  </div>
                </div>
                <div>
                  <Label>Physical Address</Label>
                  <textarea rows={3} required value={sellerAddress} onChange={(e) => setSellerAddress(e.target.value)}
                    placeholder="Full address for the inspection visit…" className={`${inputClass} resize-none`} />
                </div>
              </div>
            </div>

            {/* Upload still in progress warning */}
            {submitBlocked && (
              <div className="flex items-center gap-2 rounded-2xl bg-yellow-50 px-5 py-3 text-sm text-yellow-700">
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                Please wait for the image to finish uploading before submitting.
              </div>
            )}

            {submitError && (
              <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600">{submitError}</div>
            )}

            {/* Submit */}
            <div className="flex flex-col items-center gap-4 py-2">
              <button
                type="submit"
                disabled={submitBlocked || submitting}
                className="inline-flex min-h-14 items-center gap-3 rounded-full bg-primary px-10 font-display text-lg font-bold text-white shadow-lg transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting…
                  </>
                ) : (
                  <>
                    Request Inspection
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
              <div className="flex items-center gap-2 text-sm text-muted">
                <svg className="h-4 w-4 shrink-0 text-lime" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 1a9 9 0 100 18A9 9 0 0010 1zm3.707 7.293a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Secure · Verified inspectors · No hidden fees
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
