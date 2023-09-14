// third party
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function useSwal() {
  return withReactContent(Swal);
}
