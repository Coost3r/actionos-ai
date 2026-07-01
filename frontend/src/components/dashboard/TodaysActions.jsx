export default function TodaysActions() {

    const tasks = [

        {
            title:"Build Dashboard UI",
            priority:"High"
        },

        {
            title:"Review Meeting Notes",
            priority:"Medium"
        },

        {
            title:"Test Voice Upload",
            priority:"Low"
        }

    ];

    return(

        <section className="dashboard-section">

            <h2>Today's Actions</h2>

            {tasks.map((task,index)=>(

                <div className="task-card" key={index}>

                    <div className="task-title">
                        {task.title}
                    </div>

                    <div
                        className={`priority ${task.priority.toLowerCase()}`}
                    >
                        {task.priority}
                    </div>

                </div>

            ))}

        </section>

    );

}