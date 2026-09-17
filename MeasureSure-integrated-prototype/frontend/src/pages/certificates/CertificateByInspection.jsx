import { useCallback } from "react";
import { Navigate, useParams } from "react-router-dom";
import { getCertificateForInspection } from "../../services/certificateService.js";
import { useResource } from "../../hooks/useResource.js";
import { LoadingState } from "../../components/common/ui.jsx";

export default function CertificateByInspection() {
  const { id } = useParams();
  const load = useCallback(() => getCertificateForInspection(id), [id]);
  const { data, loading } = useResource(load);
  if (loading) return <LoadingState />;
  if (!data) return <Navigate to="/certificates" replace />;
  return <Navigate to={`/certificates/${data.id}`} replace />;
}
