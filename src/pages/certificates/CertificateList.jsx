import { useCallback, useMemo, useState } from "react";
import { Eye, FileCheck2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCertificates } from "../../services/certificateService.js";
import { getInstruments } from "../../services/instrumentService.js";
import { useResource } from "../../hooks/useResource.js";
import { Breadcrumb, Button, Card, ErrorState, FilterDropdown, LoadingState, PageHeader, SearchBar, StatusBadge } from "../../components/common/ui.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import { formatDate, optionLabel } from "../../utils/format.js";
import { instrumentTypes } from "../../config/instrumentConfig.js";

export default function CertificateList(){
 const nav=useNavigate(); const [search,setSearch]=useState(""); const [status,setStatus]=useState("");
 const load=useCallback(async()=>Promise.all([getCertificates(),getInstruments()]),[]); const {data,loading,error,reload}=useResource(load);
 const rows=useMemo(()=>{if(!data)return[];const [certs,instruments]=data;const map=new Map(instruments.map(x=>[x.id,x]));return certs.map(x=>({...x,instrument:map.get(x.instrumentId)})).filter(x=>{const hay=`${x.id} ${x.instrumentId} ${x.instrument?.owner||""}`.toLowerCase();return(!search||hay.includes(search.toLowerCase()))&&(!status||x.status===status)});},[data,search,status]);
 if(loading)return <LoadingState/>;if(error)return <ErrorState message={error} retry={reload}/>;
 const columns=[{key:"id",label:"Certificate ID"},{key:"instrumentId",label:"Instrument ID"},{key:"instrument",label:"Instrument",sortable:false,render:r=><div className="cell-stack"><strong>{optionLabel(instrumentTypes,r.instrument?.type)}</strong><small>{r.instrument?.owner||"—"}</small></div>},{key:"issueDate",label:"Issue date",kind:"date"},{key:"validUntil",label:"Valid until",kind:"date"},{key:"status",label:"Status",kind:"status"},{key:"blockchainStatus",label:"Blockchain",render:r=><span className={`blockchain-pill ${r.blockchainStatus==="CONFIRMED"?"confirmed":"pending"}`}><i/>{r.blockchainStatus}</span>},{key:"actions",label:"Actions",sortable:false,render:r=><Button variant="ghost" onClick={()=>nav(`/certificates/${r.id}`)}><Eye size={16}/>View</Button>}];
 return <><Breadcrumb items={[{label:"Certificates"}]}/><PageHeader title="Certificates" description="Review digital verification certificates issued for compliant instruments."/><Card><div className="record-toolbar"><SearchBar value={search} onChange={setSearch} placeholder="Search certificates…" label="Search certificates"/><FilterDropdown label="Status" value={status} onChange={setStatus} options={[{value:"ACTIVE",label:"Active"},{value:"EXPIRED",label:"Expired"},{value:"REVOKED",label:"Revoked"}]}/></div><DataTable columns={columns} rows={rows} label="Certificate records"/></Card></>;
}
