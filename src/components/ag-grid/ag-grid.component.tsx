import { forwardRef, useCallback, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  GridReadyEvent,
  RowDoubleClickedEvent,
  GridOptions,
  ModuleRegistry,
  ClientSideRowModelModule,
  QuickFilterModule,
  ValidationModule,
  RowSelectionModule,
  PaginationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  CustomFilterModule,
  TextEditorModule,
  CellStyleModule,
} from "ag-grid-community";
import "./ag-grid.scss";
import Loader from "components/loader/loader.component";

type gridProps = {
  columns: ColDef[];
  rows: any[] | undefined;
  rowHeight: number;
  autoFit?: boolean;
  multipleSelection?: boolean;
  searchTerm?: string;
  loading?: boolean;
  onRowDoubleClicked?: (event: RowDoubleClickedEvent) => void;
  onGridReady?: (params: GridReadyEvent) => void;
};

ModuleRegistry.registerModules([
  QuickFilterModule,
  ClientSideRowModelModule,
  ValidationModule,
  RowSelectionModule,
  PaginationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  CustomFilterModule,
  TextEditorModule,
  CellStyleModule,
]);

const AgGrid = forwardRef((props: gridProps, ref?: any) => {
  const {
    columns,
    rows,
    rowHeight,
    multipleSelection,
    searchTerm,
    loading,
    onGridReady,
    onRowDoubleClicked,
  } = props;

  const gridRef = useRef<AgGridReact>(null);

  const pagination = true;
  const paginationPageSize = 25;
  const paginationPageSizeSelector = [10, 25, 50, 100]; // Fixes warning 1 & 2

  const gridOptions: GridOptions = {
    defaultColDef: {
      editable: false,
      flex: 1,
      minWidth: 100,
      filter: true,
    },
    loadingOverlayComponent: Loader,
    loadingOverlayComponentParams: {
      loadingMessage: "",
    },
    noRowsOverlayComponentParams: {
      message: "No records found",
    },
  };

  const api = gridRef.current?.api;

  useEffect(() => {
    if (!api) return;

    const handleLoadingState = () => {
      api.setGridOption("loading", loading);
      if (!loading) {
        if (!rows || rows.length === 0) {
          api.showNoRowsOverlay();
        } else {
          api.hideOverlay();
        }
      }
    };

    handleLoadingState();
  }, [loading, rows, api]);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current!.api?.setGridOption("quickFilterText" as any, searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    onFilterTextBoxChanged();
  }, [onFilterTextBoxChanged, searchTerm]);

  return (
    <div className="ag-grid-container">
      <AgGridReact
        ref={gridRef}
        rowData={rows}
        gridOptions={gridOptions}
        columnDefs={columns}
        rowHeight={rowHeight}
        headerHeight={50}
        rowSelection={
          multipleSelection ? { mode: "multiRow" } : { mode: "singleRow" }
        }
        cacheQuickFilter={true}
        onGridReady={onGridReady}
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={paginationPageSizeSelector} // Passes valid options
        onRowDoubleClicked={onRowDoubleClicked}
      />
    </div>
  );
});

export default AgGrid;
