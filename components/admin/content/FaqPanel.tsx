"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStoreInit } from "@/hooks/use-store-init";
import useContentManagementStore from "@/store/contentManagementStore";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function FaqPanel() {
  const t = useTranslations("adminContent");
  const faqs = useContentManagementStore(state => state.faqs);
  const fetchFaqs = useContentManagementStore(state => state.fetchFaqs);
  const createFaq = useContentManagementStore(state => state.createFaq);
  const updateFaq = useContentManagementStore(state => state.updateFaq);
  const deleteFaq = useContentManagementStore(state => state.deleteFaq);
  const isLoading = useContentManagementStore(state => state.loading.fetchFaqs);
  const isSaving = useContentManagementStore(state => state.loading.saveFaq);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useStoreInit(() => fetchFaqs());

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

  const handleEdit = (id: string, q: string, a: string) => {
    setEditingId(id);
    setQuestion(q);
    setAnswer(a);
  };

  const handleDelete = async (id: string) => {
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
    <div className="space-y-6">
      <Card className="rounded-md">
        <CardContent className="grid gap-4 p-5">
          <form
            onSubmit={handleSubmit}
            className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="faq-question">{t("faqQuestion")}</Label>
              <Input
                id="faq-question"
                value={question}
                onChange={event => setQuestion(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faq-answer">{t("faqAnswer")}</Label>
              <Textarea
                id="faq-answer"
                value={answer}
                onChange={event => setAnswer(event.target.value)}
                className="min-h-28 resize-none"
                required
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="submit"
                disabled={isSaving}>
                {isSaving
                  ? t("saving")
                  : editingId
                    ? t("updateItem")
                    : t("addFaq")}
              </Button>
              {editingId ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}>
                  {t("cancelEdit")}
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      ) : faqs.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("noFaqs")}</p>
      ) : (
        <div className="space-y-3">
          {faqs.map(faq => (
            <Card
              key={faq.id}
              className="rounded-md">
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <p className="font-medium">{faq.question}</p>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleEdit(String(faq.id), faq.question, faq.answer)
                    }>
                    {t("edit")}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(String(faq.id))}>
                    {t("delete")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
