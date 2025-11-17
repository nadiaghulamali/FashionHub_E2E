export class CsvGenerator {
    private readonly HEADER = 'PR Name,Created Date,Author,URL';

    public generate(prList: any[]): string {
        const rows: string[] = [this.HEADER];

        if (prList.length === 0) {
            rows.push(`Total Open PRs: 0`);
            return rows.join("\n");
        }

        for (const pr of prList) {
            const title = pr.title || 'Unknown Title';
            const author = pr.user?.login || 'Unknown Author';
            const createdAt = pr.created_at
                ? this.formatDate(pr.created_at)
                : 'Unknown Date';
            const url = pr.html_url || 'Unknown URL';

            const escapedTitle = `"${title.replace(/"/g, '""')}"`;

            rows.push(`${escapedTitle},${createdAt},${author},${url}`);
        }

        rows.push(`Total Open PRs: ${prList.length}`);
        return rows.join("\n");
    }

    private formatDate(dateString: string): string {
        try {
            const d = new Date(dateString);
            const day = String(d.getDate()).padStart(2, "0");
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const year = d.getFullYear();
            return `${day}-${month}-${year}`;
        } catch {
            return "Invalid Date Format";
        }
    }
}
