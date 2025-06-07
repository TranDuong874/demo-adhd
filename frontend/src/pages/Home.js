import ThreeColumns from "../layout/ThreeColumns/ThreeColumns";

const Home = () => {
    var history_column =  (
        <div>
            Show task history
        </div>
    )

    // Middle pane shows the daily 
    // Middle pane has mouse click for filling in task forms
    // User fill in the tasks they need to do, and how many hours, what they need
    // AI respond with a time table in markdown and explanation
    // And a button will prrompt user to use this schedule or not
    // If not then select new

    // FLow: User goes into website => LLM: What do you need to do today?
    // LLM => Gives n schedules
    // User: Put in their task
        // If there is no Z1 -> Uses s(T | Z2)
        // Else there is Z1 -> Uses  s(T | Z2, Z1)
    // Optimization model runs => Gives best model
    // Ask user: Yes/No to accept the schedule
        // If no: start over
        // If yes: set and wait until user logs in and uses in certain hours

    var mid = (
        <div>
            
        </div>
    )

    var stats = (
        <div>
            
        </div>
    )

    return (
        <ThreeColumns left={history_column} mid="High" right="Hello"></ThreeColumns>
    );
}
 
export default Home;