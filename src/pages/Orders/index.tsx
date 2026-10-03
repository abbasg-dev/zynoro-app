import { useMemo } from "react";
import { useQuery } from "react-query";
import { ColDef } from "ag-grid-community";
import { Badge, Container } from "react-bootstrap";
import AgGrid from "components/ag-grid/ag-grid.component";
import Footer from "pages/Footer";
import { getMyOrders } from "api/services/order.services";
import { UserOrder, OrderStatus } from "interfaces/orders.model";
import { formatCurrency } from "helpers/global";
import "./orders.scss";

const getStatusBadgeBg = (status: OrderStatus) => {
  switch (status) {
    case "paid":
    case "delivered":
      return "success";
    case "processing":
    case "shipped":
      return "info";
    case "pending":
      return "warning";
    case "cancelled":
      return "danger";
    default:
      return "secondary";
  }
};

const Orders = () => {
  const { data: orders, isLoading } = useQuery<UserOrder[]>({
    queryKey: ["my-orders"],
    queryFn: getMyOrders,
  });

  const columnDefs = useMemo<ColDef<UserOrder>[]>(
    () => [
      {
        headerName: "Order ID",
        field: "id",
        minWidth: 200,
        cellRenderer: (params: any) => (
          <span className="fw-medium text-dark">{params.value}</span>
        ),
      },
      {
        headerName: "Date Ordered",
        field: "date",
        minWidth: 160,
        valueFormatter: (params) => {
          if (!params.value) return "";
          return new Date(params.value).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        },
      },
      {
        headerName: "Total Amount",
        field: "total",
        minWidth: 140,
        valueFormatter: (params) => formatCurrency(params.value || 0),
        cellStyle: { fontWeight: "600", color: "#1e1b4b" },
      },
      {
        headerName: "Payment Status",
        field: "paid",
        minWidth: 140,
        cellRenderer: (params: any) =>
          params.value ? (
            <Badge bg="success" className="px-2 py-1">
              Paid
            </Badge>
          ) : (
            <Badge bg="warning" className="px-2 py-1 text-dark">
              Unpaid
            </Badge>
          ),
      },
      {
        headerName: "Fulfillment",
        field: "delivered",
        minWidth: 140,
        cellRenderer: (params: any) =>
          params.value ? (
            <Badge bg="success" className="px-2 py-1">
              Delivered
            </Badge>
          ) : (
            <Badge bg="secondary" className="px-2 py-1">
              In Transit
            </Badge>
          ),
      },
      {
        headerName: "Order Status",
        field: "status",
        minWidth: 140,
        cellRenderer: (params: any) => {
          const status = params.value as OrderStatus;
          return (
            <Badge
              bg={getStatusBadgeBg(status)}
              className="text-capitalize px-3 py-1"
            >
              {status}
            </Badge>
          );
        },
      },
    ],
    [],
  );

  return (
    <>
      <div className="orders-page-wrapper">
        <Container className="py-4">
          <div className="orders-header mb-4">
            <h1 className="orders-title">My Orders</h1>
            <p className="orders-subtitle text-muted">
              View and track all your previous purchases and order status.
            </p>
          </div>

          <div className="orders-grid-card shadow-sm rounded bg-white p-3">
            <AgGrid
              columns={columnDefs}
              rows={orders}
              rowHeight={52}
              loading={isLoading}
            />
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Orders;
