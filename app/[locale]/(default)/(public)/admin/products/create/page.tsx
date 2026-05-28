import PageHeader from "@/components/commerce/PageHeader";
import Container from "@/components/Global/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CreateProductPage() {
  return (
    <Container className="mt-8 space-y-8 md:mt-36">
      <PageHeader
        eyebrow="Catalog"
        title="Create product"
        description="A responsive form shell ready to connect to product creation APIs."
      />
      <Card className="rounded-md">
        <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
          <Field
            name="name"
            label="Product name"
          />
          <Field
            name="price"
            label="Price"
          />
          <Field
            name="category"
            label="Category"
          />
          <Field
            name="stock"
            label="Stock"
          />
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              className="min-h-32 resize-none"
            />
          </div>
          <Button className="sm:col-span-2">Save demo product</Button>
        </CardContent>
      </Card>
    </Container>
  );
}

function Field({ name, label }: { name: string; label: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} />
    </div>
  );
}
