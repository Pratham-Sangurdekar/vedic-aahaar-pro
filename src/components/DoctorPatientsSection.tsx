import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface Patient {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
}

interface PatientProgress {
  patient: Patient;
  totalLogs: number;
  lastLogDate: string | null;
  // Add more fields as needed
}

const DoctorPatientsSection = ({ doctorId }: { doctorId: string }) => {
  const [patients, setPatients] = useState<PatientProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDummy, setShowDummy] = useState(true); // default to dummy data

  useEffect(() => {
    if (!showDummy && doctorId) {
      fetchPatients();
    }
    // eslint-disable-next-line
  }, [doctorId, showDummy]);

  const fetchPatients = async () => {
    // Find all unique patients who have chatted with this doctor
    const { data: chats } = await supabase
      .from("chats")
      .select("patient_id")
      .eq("doctor_id", doctorId);
    const patientIds = Array.from(new Set((chats || []).map((c) => c.patient_id)));
    if (patientIds.length === 0) {
      // Set dummy data into state if no real patients
      const dummyPatients = Array.from({ length: 15 }).map((_, i) => ({
        patient: {
          id: `dummy-${i}`,
          name: `Patient ${i + 1}`,
          email: `patient${i + 1}@example.com`,
          age: 20 + (i % 10),
          gender: i % 2 === 0 ? 'Male' : 'Female',
        },
        totalLogs: Math.floor(Math.random() * 100),
        lastLogDate: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString(),
      }));
      setPatients(dummyPatients);
      setLoading(false);
      return;
    }
    // Fetch patient info and progress
    const patientData = await Promise.all(
      patientIds.map(async (pid) => {
        const { data: patient } = await supabase
          .from("patients")
          .select("id, name, email, age, gender")
          .eq("id", pid)
          .single();
        // Get food log count and last log date
        const { data: logs } = await supabase
          .from("food_logs")
          .select("created_at")
          .eq("patient_id", pid)
          .order("created_at", { ascending: false });
        return {
          patient,
          totalLogs: logs ? logs.length : 0,
          lastLogDate: logs && logs.length > 0 ? logs[0].created_at : null,
        };
      })
    );
    setPatients(patientData);
    setLoading(false);
  };

  if (loading && !showDummy) return <div>Loading patients...</div>;

  // Always show dummy data by default
  if (showDummy) {
    const indianNames = [
      "Maansi Mishra", "Riddhima Shah", "Avni Sethi", "Kaushal Jain", "Lakshya Bhargav",
      "Pratham Sangurdekar", "Aditya Kadam", "Eshaan Sethi", "Krishna Joshi", "Ishaan Desai",
      "Anaya Kapoor", "Diya Shah", "Myra Jain", "Aadhya Agarwal", "Kiara Pillai",
      "Pari Menon", "Saanvi Rao", "Ira Chatterjee", "Meera Bhat", "Navya Das"
    ];
    const dummyPatients = Array.from({ length: 15 }).map((_, i) => {
      const name = indianNames[i % indianNames.length];
      const gender = i % 2 === 0 ? 'Male' : 'Female';
      return {
        patient: {
          id: `dummy-${i}`,
          name,
          email: name.toLowerCase().replace(/ /g, '.') + '@example.com',
          age: 20 + (i % 10),
          gender,
        },
        totalLogs: Math.floor(Math.random() * 100),
        lastLogDate: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString(),
      };
    });
    return (
      <div>
        <div className="mb-4 flex justify-end">
          <button
            className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/80 transition"
            onClick={() => setShowDummy(false)}
          >
            Edit Patient List
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyPatients.map(({ patient, totalLogs, lastLogDate }) => (
            <Card key={patient.id} className="mandala-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      {patient.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <div className="text-sm text-muted-foreground">Age: {patient.age} | {patient.gender}</div>
                    <div className="text-xs text-muted-foreground">Last log: {lastLogDate ? new Date(lastLogDate).toLocaleDateString() : "Never"}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-2">Total Food Logs: {totalLogs}</div>
                <Progress value={Math.min(totalLogs, 100)} max={100} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (patients.length === 0) return <div>No patients found.</div>;

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/80 transition"
          onClick={() => setShowDummy(true)}
        >
          Show Dummy Data
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map(({ patient, totalLogs, lastLogDate }) => {
          if (!patient) return null;
          return (
            <Card key={patient.id} className="mandala-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      {patient.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <div className="text-sm text-muted-foreground">Age: {patient.age} | {patient.gender}</div>
                    <div className="text-xs text-muted-foreground">Last log: {lastLogDate ? new Date(lastLogDate).toLocaleDateString() : "Never"}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-2">Total Food Logs: {totalLogs}</div>
                <Progress value={Math.min(totalLogs, 100)} max={100} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DoctorPatientsSection;
