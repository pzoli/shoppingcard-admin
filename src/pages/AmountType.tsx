import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable, DataTableStateEvent, DataTableSelectionChangeEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from "primereact/toast";
import { useForm, Controller } from "react-hook-form";
import { InputText } from 'primereact/inputtext';
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog } from 'primereact/confirmdialog';

interface FormValues {
    name: string;
}

const AmountType = () => {
    const queryClient = useQueryClient();
    const [lazyState, setLazyState] = useState<DataTableStateEvent>({
        first: 0,
        rows: 10,
        page: 0,
        pageCount: 0,
        sortField: "",
        sortOrder: 1,
        multiSortMeta: [],
        filters: {
        },
    });

    const [editedRow, setEditedRow] = useState<any>({});
    const [selectedRow, setSelectedRow] = useState<any>({});
    const [visible, setVisible] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);

    const onPage = useCallback((event: DataTableStateEvent) => {
        setLazyState(event);
    }, []);
    
    const onFilter = useCallback((event: DataTableStateEvent) => {
        event.first = 0;
        setLazyState(event);
    }, []);
    
    const onSelectionChange = useCallback((e: DataTableSelectionChangeEvent<any>) => {
        setSelectedRow(e.value);
    }, []);

    const updatePage = () => {
        queryClient.invalidateQueries({ queryKey: ["amounttype"] });
        queryClient.invalidateQueries({ queryKey: ["amounttypecount"] });
    };

    const { data: amountTypeValues, status: dataFetchStatus, isLoading: isDataLoading } = useQuery({
        queryKey: ["amounttype", lazyState],
        queryFn: async () => {
                const filters = encodeURIComponent(JSON.stringify(lazyState.filters));
                const res = await fetch(`/api/admin/crud/amounttype?first=${lazyState.first}&rowcount=${lazyState.rows}&filter=${filters}`);
                return res.json();
        }
    });
    
    const { data: count, isLoading: isCountLoading } = useQuery<number>({
        queryKey: ["amounttypecount", lazyState],
        queryFn: async () => {
            const filters = encodeURIComponent(JSON.stringify(lazyState.filters));
            const res = await fetch(`/api/admin/crud/amounttype/count?filter=${filters}`);
            const { count } = await res.json();
            return count;
        }
    });


    async function resolver(values: any) {
        return {
            values: {},
            errors: {},
        };
    }

    const toast = useRef<Toast>(null);
    const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({ resolver });

    const onSubmit = (data: any) => {
        const params = {
            name: control._formValues['name'],
        };
        if (editedRow && editedRow._id) {
            fetch('/api/admin/crud/amounttype/' + editedRow._id, {
                method: 'PUT',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                cache: 'no-cache',
                body: JSON.stringify(params),
            }).then((response) => { return response.json() }).then((data) => {
                updatePage();
                setVisible(false);
                show("success", `Updated topic: ${JSON.stringify(data)}`);
            }).catch((err) => show("error", err));
        } else {
            fetch('/api/admin/crud/amounttype', {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                cache: 'no-cache',
                body: JSON.stringify(params),
            }).then((response) => { return response.json() }).then((data) => {
                updatePage();
                setVisible(false);
                show('success', `Saved topic: ${JSON.stringify(data)}`);
            }).catch((err) => show('error', err));
        }
    }

    const show = (severity: "success" | "info" | "warn" | "error" | undefined, message: string) => {
        if (toast.current !== null) {
            toast.current.show({ severity: severity, summary: 'Form submit', detail: message });
        }
    }

    useEffect(() => {
        //console.log(selectedRows);
        if (editedRow) {
            setValue("name", editedRow.name);
        } else {
            setValue("name", '');
        }
    }, [editedRow]);

    const deleteSelectedRow = () => {
        fetch('/api/admin/crud/amounttype/' + selectedRow._id, {
            method: 'DELETE',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            cache: 'no-cache',
            body: JSON.stringify({ action: 'delete' }),
        }).then((response) => {
            return response.json();
        }).then(data => {
            show("success", `Deleted AmountType: ${JSON.stringify(data)}`);
            updatePage();
        }).catch((err) => show("error", err));
    }

    return (
        <div className="card">
            <h2>AmountType</h2>
            <Toast ref={toast} />
            <Dialog header="AmountType" visible={visible} onHide={() => setVisible(false)} style={{ width: '50vw' }}>
                <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: 'name is required.' }}
                        render={({ field, fieldState }) => (
                            <>
                                <div className="grid align-items-baseline">
                                    <div className="col-12 mb-2 md:col-2 md:mb-0">
                                        <label htmlFor={field.name}>name: </label>
                                    </div>
                                    <div className="col-12 md:col-10">
                                        <InputText id={field.name} value={field.value || ''} onChange={field.onChange} style={{ width: '100%' }} />
                                    </div>
                                </div>
                            </>
                        )}
                    />
                    <div className='flex justify-content-end'>
                        <Button label="Submit" type="submit" icon="pi pi-check" />
                    </div>
                </form>
            </Dialog>
            <ConfirmDialog visible={confirmDialogVisible} accept={deleteSelectedRow} message="Are you sure you want to delete item?"
                header="Confirmation" icon="pi pi-exclamation-triangle" onHide={() => setConfirmDialogVisible(false)} />
            <div className="card">
                <DataTable value={ amountTypeValues }
                        responsiveLayout="scroll"
                        selectionMode="single"
                        selection={selectedRow}
                        onSelectionChange={onSelectionChange}
                        first={lazyState.first}
                        paginator={true}
                        lazy={true}
                        rows={10}
                        totalRecords={count ?? 0}
                        onPage={onPage}
                        loading={isDataLoading || isCountLoading}
                        onFilter={onFilter}
                        filters={lazyState.filters}
                        filterDisplay="row"
                        tableStyle={{ minWidth: '50rem' }}    
                    >
                    <Column selectionMode="single" header="Select one"></Column>
                    <Column field="_id" header="ID"></Column>
                    <Column field="name" header="Name"></Column>
                </DataTable>
            </div>
            <div className='vertical-align-baseline'>
                <Button label="New" icon="pi pi-check" onClick={() => {
                    setSelectedRow(null);
                    setEditedRow({});
                    setVisible(true);
                }} />
                <Button label="Modify" icon="pi pi-check" onClick={() => {
                    setEditedRow(selectedRow);
                    setVisible(true);
                } } disabled={selectedRow && selectedRow._id ? false : true} />
                <Button label="Delete" icon="pi pi-check" onClick={() => setConfirmDialogVisible(true)} disabled={selectedRow && selectedRow._id ? false : true} />
            </div>
        </div>
    )
}

export default AmountType;
