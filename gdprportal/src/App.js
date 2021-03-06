import './App.css';
import SignUp from "./SignUp";
import { ToastProvider } from "react-toast-notifications";

function App() {
  return (
      <ToastProvider
          autoDismiss={true}
          autoDismissTimeout={10000}
          placement="bottom-center"
      >
        <SignUp />
      </ToastProvider>

  );
}

export default App;
