import "./Section.css";

export default function SummarySection({ summary }) {

    if (!summary) return null;

    const summaryItems = Array.isArray(summary)
        ? summary
        : [summary];

    return (
        <section className="result-section">

            <h2 className="section-title">Summary</h2>

            <ul>
                {summaryItems.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>

        </section>
    );
}