import { Link } from "react-router-dom";

const Homepage = () => {
    return (
        <div className="homepage">
        <h1 className="homepage-h1">AI Health Advisor <img src="/caduceus.png" alt="icon" className="homepage-icon"/></h1>
        <p className="homepage-p">This is a simple chatbot to take advice regarding your helath problems.</p>
        <Link to={"/chat"} ><button className="homepage-link">Start Chat</button></Link>
        </div>
    );
}

export default Homepage;