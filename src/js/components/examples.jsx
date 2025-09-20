import { memo } from "react";
import { FormattedMessage } from "react-intl";
import { Globe, Microscope, Hash, Book, ListChecks } from "lucide-react";

const Examples = () => (
  <div id="examples" className="mt-4">
    <div className="rounded-lg border bg-card p-5 md:p-6 shadow-sm">
      <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
        <ListChecks className="inline h-5 w-5 text-primary -mt-1 mr-2" aria-hidden="true" />
        <FormattedMessage
          id="zbib.about.section.examples"
          description="examples-section-title"
          defaultMessage="Examples"
        />
      </h3>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-1 lg:gap-8">
        {/* Website URLs */}
        <div className="flex items-start gap-3">
          <span className="rounded-md bg-background p-1.5">
            <Globe className="h-5 w-5 text-primary" aria-hidden="true" />
          </span>
          <div>
            <h4 className="text-base font-semibold leading-6">Website URLs</h4>
            <p className="mt-2 text-sm text-muted-foreground">Enter a website address (URL):</p>
            <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
              <li>
                <a className="underline underline-offset-4 hover:text-foreground break-all" href="https://cite.mickschroeder.com/?q=https%3A%2F%2Fwww.nejm.org%2Fdoi%2Ffull%2F10.1056%2FNEJMoa1403108">https://nejm.org/…</a>
              </li>
              <li>
                <a className="underline underline-offset-4 hover:text-foreground break-all" href="https://cite.mickschroeder.com/?q=https%3A%2F%2Fwww.nytimes.com%2F2013%2F03%2F05%2Fscience%2Fchasing-the-higgs-boson-how-2-teams-of-rivals-at-CERN-searched-for-physics-most-elusive-particle.html">https://nytimes.com/…</a>
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
            <p className="mt-2 text-sm text-muted-foreground">Enter a PMID (PubMed ID) or URL:</p>
            <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
              <li>
                <a className="underline underline-offset-4 hover:text-foreground break-all" href="https://cite.mickschroeder.com/?q=30280635">30280635</a>
              </li>
              <li>
                <a className="underline underline-offset-4 hover:text-foreground break-all" href="https://cite.mickschroeder.com/?q=https%3A%2F%2Fpubmed.ncbi.nlm.nih.gov%2F30280635%2F">https://pubmed.ncbi.nlm.nih.gov/…</a>
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
            <p className="mt-2 text-sm text-muted-foreground">Persistent identifiers for many kinds of work:</p>
            <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
              <li>
                <a className="underline underline-offset-4 hover:text-foreground break-all" href="https://cite.mickschroeder.com/?q=10.1126%2Fscience.169.3946.635">10.1126/science.169.3946.635</a>
              </li>
              <li>
                <a className="underline underline-offset-4 hover:text-foreground break-all" href="https://cite.mickschroeder.com/?q=https%3A%2F%2Fdoi.org%2F10.1038/nature21360">https://doi.org/…</a>
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
            <p className="mt-2 text-sm text-muted-foreground">A unique numeric book identifier:</p>
            <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
              <li>
                <a className="underline underline-offset-4 hover:text-foreground break-all" href="https://cite.mickschroeder.com/?q=0323040683">0323040683</a>
              </li>
              <li>
                <a className="underline underline-offset-4 hover:text-foreground break-all" href="https://cite.mickschroeder.com/?q=https%3A%2F%2Fwww.amazon.com%2Fs%3Fk%3D0702052302">https://amazon.com/…</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default memo(Examples);
