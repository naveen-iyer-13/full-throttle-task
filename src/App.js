import React, { useState, useEffect } from 'react';
import LoadingModal from './LoadingModal'
import { Layout } from 'antd';
import { Table, Tag } from 'antd';
import FullCalendar from '@fullcalendar/react'
import { Modal, Button } from 'antd';
import resourceDayGridPlugin from '@fullcalendar/resource-daygrid';
import moment from 'moment'
import testData from './testData'
import './App.css';
const { Header } = Layout;

let columns = [
  {
    title: 'ID',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: 'Name',
    dataIndex: 'real_name',
    key: 'real_name',
  },
  {
    title: 'Timezone',
    dataIndex: 'tz',
    key: 'tz',
  },
]

function App(props){

  const [data, setTestData] = useState(testData.members)
  const [loadingText, setLoadingText] = useState('')
  const [showDetails, setShowDetails] = useState(false)
  const [selectedRow, setSelectedRow] = useState({})

  const convertTime = (timestamp) => {
    var date = new Date(timestamp*1000);
    var cHours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var cMinutes = date.getMinutes() === 0 ? "00" : date.getMinutes() ;
    var AMPM = "PM"
    if (cHours < 12) {
      AMPM = "AM"
    }

    if (timestamp !== null) {
      return [
        cHours,
        ":",
        cMinutes,
      ].join('');                                  // Glue the pieces together
    }
    else {
      return "";
    }
  }


  useEffect(() => {
    var arrangedData = []
    data.forEach((single, id) => {
      let newActivity = single.activity_periods.map(act => {
        let title = "" + convertTime(act.start_time)  + " to " + convertTime(act.end_time)
        return {start: new Date(act.start_time*1000), end: new Date(act.end_time*1000), title: title};
      })
      arrangedData.push({
        ...single,
        index: id+1,
        activity_periods: newActivity
      })
    })
    setTestData(arrangedData)
  }, [])

  const onSelect = (id) => {
    setShowDetails(true)
    let row = data.filter(row => row.index === id)
    setSelectedRow(row[0])
    console.log(row);
  }

  const handleCancel = () => {
    setShowDetails(false)
    setSelectedRow({})
  }


  return (
    <div className="app">
        <h1 className="header">Members List</h1>
        <p className="hint">Click on any row to get the activity details of the particular user</p>
        <div className="table-container">
          <Table columns={columns} dataSource={data}
            onRow={(record, rowIndex) => {
              return {
                onClick: event => {onSelect(record.index)}, // click row
              };
            }}
            />
        </div>
        <Modal
          title="User Activity Details"
          visible={showDetails}
          onOk={() => handleCancel()}
          onCancel={() => handleCancel()}
          >
          <p className="modal-hint">Displaying the time when user was online</p>
          <FullCalendar
            defaultView="dayGridMonth"
            plugins={[ resourceDayGridPlugin ]}
            events={selectedRow && selectedRow.activity_periods ? selectedRow.activity_periods : []}
            />
        </Modal>
    </div>
  )

}



export default App
