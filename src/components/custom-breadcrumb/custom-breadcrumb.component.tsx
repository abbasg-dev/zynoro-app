import { Breadcrumb } from "react-bootstrap";
import "./custom-breadcrumb.scss";

interface BreadcrumbProps {
  items?: {
    label?: string;
    onClick?: () => void;
  }[];
}

const CustomBreadcrumb = (props: BreadcrumbProps) => {
  const { items } = props;

  return (
    <Breadcrumb className="custom-breadcrumb">
      {items?.map((item, index) => {
        const isLast = index === items.length - 1;
        const isClickable = !isLast && !!item?.onClick;

        return (
          <Breadcrumb.Item
            key={index}
            active={isLast}
            onClick={isClickable ? item.onClick : undefined}
            linkAs={!isClickable ? "span" : undefined}
            className={
              isClickable
                ? "breadcrumb-link"
                : isLast
                  ? "breadcrumb-item-active"
                  : "breadcrumb-text"
            }
          >
            {item.label}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

export default CustomBreadcrumb;
