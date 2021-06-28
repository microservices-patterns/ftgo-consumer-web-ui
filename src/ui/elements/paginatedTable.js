import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
  SizePerPageDropdownStandalone
} from 'react-bootstrap-table2-paginator';
import './reactBootstrapTableCustomization.scss';
import React from 'react';
import { e2eAssist } from '../../testability';

export const PaginatedTable = ({
                                 data,
                                 columns,
                                 keyField,
                                 noPagination,
                                 paginationOnTop,
                                 paginationFactoryOptions,
                                 'data-testid': dataTestIdAttr,
                                 ...tableProps
                               }) =>
  noPagination ?
    <div { ...(dataTestIdAttr ? { 'data-testid': dataTestIdAttr } : {}) }><BootstrapTable
      keyField={ keyField }
      data={ data }
      columns={ columns }
      { ...tableProps }
    /></div> :
    <PaginationProvider pagination={ paginationFactory({
      ...paginationFactoryOptions,
      totalSize: data?.length ?? 0
    }) }>{
      ({
         paginationProps,
         paginationTableProps // : { pagination: { options, ...restPagination } }
       }) => (
        <div className="d-flex flex-column" { ...(dataTestIdAttr ? { 'data-testid': dataTestIdAttr } : {}) }>
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
              <div className="d-inline-block mb-3"  { ...e2eAssist.CTL_SIZE_PER_PAGE_FOR_TABLE }>
                <SizePerPageDropdownStandalone
                  { ...paginationProps }
                /></div>

              <div className="d-inline-block" { ...e2eAssist.CTL_PAGINATION_FOR_TABLE }><PaginationListStandalone
                { ...paginationProps }
              /></div>
            </div>
          </div>
        </div>
      )
    }</PaginationProvider>;
