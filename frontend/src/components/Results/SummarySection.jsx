import "./Section.css";

export default function SummarySection({ summary }) {

    if (!summary || summary.length === 0)
        return null;

    return (

        <section className="result-section">

            <h2>Summary</h2>

            <ul>

                {summary.map((item,index)=>(

                    <li key={index}>{item}</li>

                ))}

            </ul>

        </section>

    );

}