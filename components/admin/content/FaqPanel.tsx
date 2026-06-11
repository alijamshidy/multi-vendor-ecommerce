"use client";

import ContentFormActions from "@/components/admin/content/ContentFormActions";
import ContentListItem from "@/components/admin/content/ContentListItem";
import ContentPanelLayout from "@/components/admin/content/ContentPanelLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useContentManagementStore from "@/store/contentManagementStore";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function FaqPanel() {
  const t = useTranslations("adminContent");
  const faqs = useContentManagementStore(state => state.faqs);
  const createFaq = useContentManagementStore(state => state.createFaq);
  const updateFaq = useContentManagementStore(state => state.updateFaq);
  const deleteFaq = useContentManagementStore(state => state.deleteFaq);
  const isLoading = useContentManagementStore(state => state.loading.fetchFaqs);
  const isSaving = useContentManagementStore(state => state.loading.saveFaq);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    try {
      if (editingId) {
        await updateFaq(editingId, {
          question: question.trim(),
          answer: answer.trim(),
        });
        toast.success(t("faqUpdated"));
      } else {
        await createFaq({ question: question.trim(), answer: answer.trim() });
        toast.success(t("faqCreated"));
      }
      resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("faqSaveFailed"),
      );
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(t("deleteConfirm", { name }))) return;

    try {
      await deleteFaq(id);
      toast.success(t("faqDeleted"));
      if (editingId === id) resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("faqDeleteFailed"),
      );
    }
  };

  return (
    <ContentPanelLayout
      title={t("faqSectionTitle")}
      description={t("faqSectionDesc")}
      storeLocation={t("faqStoreLocation")}
      isEditing={Boolean(editingId)}
      itemCount={faqs.length}
      isLoading={isLoading}
      emptyMessage={t("noFaqs")}
      form={
        <form
          onSubmit={handleSubmit}
          className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="faq-question">{t("faqQuestion")}</Label>
            <Input
              id="faq-question"
              value={question}
              onChange={event => setQuestion(event.target.value)}
              placeholder={t("faqQuestionPlaceholder")}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="faq-answer">{t("faqAnswer")}</Label>
            <Textarea
              id="faq-answer"
              value={answer}
              onChange={event => setAnswer(event.target.value)}
              placeholder={t("faqAnswerPlaceholder")}
              className="min-h-32 resize-none"
              required
            />
          </div>
          <ContentFormActions
            isSaving={isSaving}
            isEditing={Boolean(editingId)}
            createLabel={t("addFaq")}
            onCancel={resetForm}
          />
        </form>
      }>
      {faqs.map((faq, index) => (
        <ContentListItem
          key={faq.id}
          title={`${index + 1}. ${faq.question}`}
          subtitle={faq.answer}
          isActive={editingId === String(faq.id)}
          onEdit={() => {
            setEditingId(String(faq.id));
            setQuestion(faq.question);
            setAnswer(faq.answer);
          }}
          onDelete={() => void handleDelete(String(faq.id), faq.question)}
        />
      ))}
    </ContentPanelLayout>
  );
}
