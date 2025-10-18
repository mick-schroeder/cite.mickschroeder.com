import { memo } from "react";
import { FormattedMessage } from "react-intl";
import {
  Globe,
  Microscope,
  Hash,
  Book,
  Lightbulb,
  Library,
  Database,
  Newspaper,
  Layers,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";

const Examples = () => (
  <section className="section" id="examples">
    <Card className="bg-background border-0 shadow-none">
      <CardHeader>
        <CardTitle>
          <Lightbulb
            className="inline h-5 w-5 text-primary mr-2"
            aria-hidden="true"
          />
          <FormattedMessage
            id="zbib.about.section.examples"
            description="examples-section-title"
            defaultMessage="Query Examples"
          />
        </CardTitle>
        <CardDescription>
          <FormattedMessage
            id="examples.description"
            defaultMessage="Backed by the open-source community, it understands hundreds of formats, from academic journals and library catalogs to news sites, PubMed, DOIs, ISBNs, and more."
          />
        </CardDescription>{" "}
      </CardHeader>

      <CardContent className="grid gap-6 sm:grid-cols-2">
        {/* Website URLs */}
        <div className="flex items-start gap-3">
          <span className="rounded-md bg-background p-1.5">
            <Globe className="h-5 w-5 text-primary" aria-hidden="true" />
          </span>
          <div>
            <h4 className="text-base font-semibold leading-6">Website URLs</h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter a website address (URL):
            </p>
            <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
              <li>
                <a
                  className="underline underline-offset-4 hover:text-foreground break-all"
                  href="https://cite.mickschroeder.com/?q=https%3A%2F%2Fwww.nejm.org%2Fdoi%2Ffull%2F10.1056%2FNEJMoa1403108"
                >
                  https://nejm.org/…
                </a>
              </li>
              <li>
                <a
                  className="underline underline-offset-4 hover:text-foreground break-all"
                  href="https://cite.mickschroeder.com/?q=https%3A%2F%2Fwww.nytimes.com%2F2013%2F03%2F05%2Fscience%2Fchasing-the-higgs-boson-how-2-teams-of-rivals-at-CERN-searched-for-physics-most-elusive-particle.html"
                >
                  https://nytimes.com/…
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* PubMed */}
        <div className="flex items-start gap-3">
          <span className="rounded-md bg-background p-1.5">
            <Microscope className="h-5 w-5 text-primary" aria-hidden="true" />
          </span>
          <div>
            <h4 className="text-base font-semibold leading-6">PubMed</h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter a PMID (PubMed ID) or URL:
            </p>
            <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
              <li>
                <a
                  className="underline underline-offset-4 hover:text-foreground break-all"
                  href="https://cite.mickschroeder.com/?q=30280635"
                >
                  30280635
                </a>
              </li>
              <li>
                <a
                  className="underline underline-offset-4 hover:text-foreground break-all"
                  href="https://cite.mickschroeder.com/?q=https%3A%2F%2Fpubmed.ncbi.nlm.nih.gov%2F30280635%2F"
                >
                  https://pubmed.ncbi.nlm.nih.gov/…
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* DOI */}
        <div className="flex items-start gap-3">
          <span className="rounded-md bg-background p-1.5">
            <Hash className="h-5 w-5 text-primary" aria-hidden="true" />
          </span>
          <div>
            <h4 className="text-base font-semibold leading-6">DOI</h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Persistent identifiers for many kinds of work:
            </p>
            <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
              <li>
                <a
                  className="underline underline-offset-4 hover:text-foreground break-all"
                  href="https://cite.mickschroeder.com/?q=10.1126%2Fscience.169.3946.635"
                >
                  10.1126/science.169.3946.635
                </a>
              </li>
              <li>
                <a
                  className="underline underline-offset-4 hover:text-foreground break-all"
                  href="https://cite.mickschroeder.com/?q=https%3A%2F%2Fdoi.org%2F10.1038/nature21360"
                >
                  https://doi.org/…
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ISBN */}
        <div className="flex items-start gap-3">
          <span className="rounded-md bg-background p-1.5">
            <Book className="h-5 w-5 text-primary" aria-hidden="true" />
          </span>
          <div>
            <h4 className="text-base font-semibold leading-6">ISBN</h4>
            <p className="mt-2 text-sm text-muted-foreground">
              A unique numeric book identifier:
            </p>
            <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
              <li>
                <a
                  className="underline underline-offset-4 hover:text-foreground break-all"
                  href="https://cite.mickschroeder.com/?q=0323040683"
                >
                  0323040683
                </a>
              </li>
              <li>
                <a
                  className="underline underline-offset-4 hover:text-foreground break-all"
                  href="https://cite.mickschroeder.com/?q=https%3A%2F%2Fwww.amazon.com%2FAnatomy-Leatherbound-Classics-Classic-Collection%2Fdp%2F1435114930%2Fref%3Dsr_1_1%3Fcrid%3D34JFSFOLR9PUG%26dib%3DeyJ2IjoiMSJ9.dxuOCvahydDAJlY4R-RX8n86RckzvaH-4xHzEV-12MZzfdYF9CH0TFyTla3ihKXxPAwY_G_9xMvTDk5ndDTuji4RkZ9gwz6ZDTA9kFSbWr_XmR3wXuMKBfi68eviMqFNq6c7f5ycXq02txuBiAvTAYEqCzvNhJqM9_F8IM4FoFvRc2SRiCvSI-bOZ-MWUJcC4uXS_aF3SAWW9GSnb5aNkoIFSZoFswOCaYRsi4FzCPU.0HbUnyE0qkeNN2NU5yWEYlTQ18sR0kyUvIERSHTU5Zs%26dib_tag%3Dse%26keywords%3Dgreys%2Banatomy%26qid%3D1759084560%26s%3Dbooks%26sprefix%3Dgreys%2Banatomy%252Cstripbooks%252C57%26sr%3D1-1"
                >
                  https://amazon.com/…
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Library Catalogs (WorldCat) */}
        <div className="flex items-start gap-3">
          <span className="rounded-md bg-background p-1.5">
            <Library className="h-5 w-5 text-primary" aria-hidden="true" />
          </span>
          <div>
            <h4 className="text-base font-semibold leading-6">
              Library Catalogs
            </h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Paste a catalog permalink (e.g., WorldCat):
            </p>
            <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
              <li>
                <a
                  className="underline underline-offset-4 hover:text-foreground break-all"
                  href="https://cite.mickschroeder.com/?q=https%3A%2F%2Fwww.worldcat.org%2Ftitle%2Foclc%2F318877771"
                >
                  https://worldcat.org/title/oclc/318877771
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Academic Databases (JSTOR) */}
        <div className="flex items-start gap-3">
          <span className="rounded-md bg-background p-1.5">
            <Database className="h-5 w-5 text-primary" aria-hidden="true" />
          </span>
          <div>
            <h4 className="text-base font-semibold leading-6">
              Academic Databases
            </h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Many databases work (access permitting). Example:
            </p>
            <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
              <li>
                <a
                  className="underline underline-offset-4 hover:text-foreground break-all"
                  href="https://cite.mickschroeder.com/?q=https%3A%2F%2Fwww.jstor.org%2Fstable%2F10.1086%2F683612"
                >
                  https://jstor.org/stable/10.1086/683612
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Publisher Sites (SpringerLink) */}
        <div className="flex items-start gap-3">
          <span className="rounded-md bg-background p-1.5">
            <Newspaper className="h-5 w-5 text-primary" aria-hidden="true" />
          </span>
          <div>
            <h4 className="text-base font-semibold leading-6">
              Publisher Sites
            </h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Direct article pages often work, too:
            </p>
            <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
              <li>
                <a
                  className="underline underline-offset-4 hover:text-foreground break-all"
                  href="https://cite.mickschroeder.com/?q=https%3A%2F%2Flink.springer.com%2Farticle%2F10.1007%2Fs00134-020-06106-6"
                >
                  https://link.springer.com/article/...
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* And More... */}
        <div className="flex items-start gap-3">
          <span className="rounded-md bg-background p-1.5">
            <Layers className="h-5 w-5 text-primary" aria-hidden="true" />
          </span>
          <div>
            <h4 className="text-base font-semibold leading-6">
              And Hundreds More...
            </h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Uses community‑maintained translators to detect and import from a
              wide range of sources. More than 600 different translators are
              available and constantly updated.
            </p>
            <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
              <li>
                <a
                  className="underline underline-offset-4 hover:text-foreground break-all"
                  target="_blank"
                  href="https://github.com/zotero/translators"
                >
                  See them all on Github
                </a>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  </section>
);

export default memo(Examples);
