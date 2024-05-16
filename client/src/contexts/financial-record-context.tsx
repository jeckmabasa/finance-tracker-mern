import { useUser } from "@clerk/clerk-react";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface FinancialRecord {
    _id?: string;
    userId: string;
    date: Date;
    description: string;
    amount: number;
    category: string;
    paymentMethod: string;
}

interface FinancialRecordContextType {
    records: FinancialRecord[];
    addRecord: (record: FinancialRecord) => void;
    updateRecord: (id: string, newRecord: FinancialRecord) => void;
    deleteRecord: (id: string) => void;
}
export const FinancialRecordsContext = createContext<FinancialRecordContextType | undefined>(undefined);

export const FinancialRecordProvider = ({children}: {children: React.ReactNode}) => {
    const [records, setRecords] = useState<FinancialRecord[]>([]);
    const { user } = useUser();

    const fetchRecord = async () => {
        if (!user) return;
        const response = await fetch(`http://localhost:3001/financial-records/getAllByUserID/${user?.id}`)
        if (response.ok) {
            const records = await response.json()
            setRecords(records)
        }
    }

    useEffect(() => {
        fetchRecord()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const addRecord = async (record: FinancialRecord) => {
        const response = await fetch('http://localhost:3001/financial-records', {
            method: 'POST',
            body: JSON.stringify(record),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        try {
            if (response.ok) {
                const newRecord = await response.json()
                setRecords((prev) => [...prev, newRecord])
            }
        } catch (error) { /* empty */ }
    };

    const updateRecord = async (id: string, newRecord: FinancialRecord) => {
        const response = await fetch(`http://localhost:3001/financial-records/${id}`, {
            method: 'PUT',
            body: JSON.stringify(newRecord),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        try {
            if (response.ok) {
                const newRecord = await response.json()
                setRecords((prev) => prev.map((record) => {
                    if (record._id === id) return newRecord
                    else return record
                }))
            }
        } catch (error) { /* empty */ }
        
    };

    const deleteRecord = async (id: string) => {
        const response = await fetch(`http://localhost:3001/financial-records/${id}`, {
            method: 'DELETE',
        })
        try {
            if (response.ok) {
                const deletedRecord = await response.json()
                setRecords((prev) => prev.filter((record) => record._id !== deletedRecord._id))
            }
        } catch (error) { /* empty */ }
    };
    return (
        <FinancialRecordsContext.Provider value={{records, addRecord, updateRecord, deleteRecord}}>
            {children}
        </FinancialRecordsContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFinancialRecords = () => {
    const context = useContext<FinancialRecordContextType | undefined>(FinancialRecordsContext)
    if (!context) throw new Error('useFinancialRecords must be used within a FinancialRecordProvider')
    return context
}