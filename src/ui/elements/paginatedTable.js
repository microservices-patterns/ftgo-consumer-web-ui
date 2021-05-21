import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
  SizePerPageDropdownStandalone
} from 'react-bootstrap-table2-paginator';
import './reactBootstrapTableCustomization.scss';

export const PaginatedTable = ({
                                 data,
                                 columns,
                                 keyField,
                                 noPagination,
                                 paginationOnTop,
                                 paginationFactoryOptions,
                                 ...tableProps
                               }) =>
  noPagination ?
    <BootstrapTable
      keyField={ keyField }
      data={ data }
      columns={ columns }
      { ...tableProps }
    /> :
    <PaginationProvider pagination={ paginationFactory({
      ...paginationFactoryOptions,
      totalSize: data?.length ?? 0
    }) }>{
      ({
         paginationProps,
         paginationTableProps // : { pagination: { options, ...restPagination } }
       }) => (
        <div className="d-flex flex-column">
          <div className={ paginationOnTop ? 'order-1' : 'order-0' }
          ><BootstrapTable
            keyField={ keyField }
            data={ data }
            columns={ columns }
            { ...tableProps }
            { ...paginationTableProps }

          /></div>
          <div className={ paginationOnTop ? 'order-0' : 'order-1' }>
            <div className="d-flex flex-row justify-content-between align-content-start flex-wrap">
              <SizePerPageDropdownStandalone
                { ...paginationProps }
              />

              <PaginationListStandalone
                { ...paginationProps }
              />
            </div>
          </div>
        </div>
      )
    }</PaginationProvider>;
