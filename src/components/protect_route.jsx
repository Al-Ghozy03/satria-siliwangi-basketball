import { useRouter } from "next/navigation";
export default function ProtectRoute({ children }) {
  const router = useRouter();
  if (!localStorage.getItem("token")) return router.replace("/login");
  return children;
}
