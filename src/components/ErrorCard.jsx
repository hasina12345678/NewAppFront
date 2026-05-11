import { FaExclamationTriangle } from "react-icons/fa";
import './ErrorCard.css';

function ErrorCard({ message }) {
    return (
        <div className="error-component">
            <div className="icon-error">
                <FaExclamationTriangle className="error" />
            </div>
            <div className="message">
                <h3>{ message }</h3>
            </div>
        </div>
    );
}

export default ErrorCard;