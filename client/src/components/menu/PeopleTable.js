import React from 'react'
import Axios from 'axios'
import {
    Table, Input, Button, Popconfirm, Form, Modal
  } from 'antd';
import API from '../../util/api'

  const FormItem = Form.Item;
  const EditableContext = React.createContext();
    
  const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
      <tr {...props} />
    </EditableContext.Provider>
  );
  
  const EditableFormRow = Form.create()(EditableRow);
  
  class EditableCell extends React.Component {
    state = {
      editing: false,
    }
  
    componentDidMount() {
      if (this.props.editable) {
        document.addEventListener('click', this.handleClickOutside, true);
      }
    }
  
    componentWillUnmount() {
      if (this.props.editable) {
        document.removeEventListener('click', this.handleClickOutside, true);
      }
    }
  
    toggleEdit = () => {
      const editing = !this.state.editing;
      this.setState({ editing }, () => {
        if (editing) {
          this.input.focus();
        }
      });
    }
  
    handleClickOutside = (e) => {
      const { editing } = this.state;
      if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
        this.save();
      }
    }
  
    save = () => {
      const { record, handleSave } = this.props;
      this.form.validateFields((error, values) => {
        if (error) {
          return;
        }
        this.toggleEdit();
        handleSave({ ...record, ...values });
      });
    }
  
    render() {
      const { editing } = this.state;
      const {
        editable,
        dataIndex,
        title,
        record,
        index,
        handleSave,
        ...restProps
      } = this.props;
      return (
        <td ref={node => (this.cell = node)} {...restProps}>
          {editable ? (
            <EditableContext.Consumer>
              {(form) => {
                this.form = form;
                return (
                  editing ? (
                    <FormItem style={{ margin: 0 }}>
                      {form.getFieldDecorator(dataIndex, {
                        rules: [{
                          required: true,
                          message: `${title} is required.`,
                        }],
                        initialValue: record[dataIndex],
                      })(
                        <Input
                          ref={node => (this.input = node)}
                          onPressEnter={this.save}
                        />
                      )}
                    </FormItem>
                  ) : (
                    <div
                      className='editable-cell-value-wrap'
                      style={{ paddingRight: 24 }}
                      onClick={this.toggleEdit}
                    >
                      {restProps.children}
                    </div>
                  )
                );
              }}
            </EditableContext.Consumer>
          ) : restProps.children}
        </td>
      );
    }
  }
  
  class EditableTable extends React.Component {
    constructor(props) {
			super(props);
			this.state = {
				dataSource: [],
				selectedRowKeys: [],
        manualKey: 0, // will need to change this later
        clickedData: [],
        visible: false
      };
      
      this.columns = [
				{
          key: 'name',
					title: '이름',
					dataIndex: 'name',
				}, 
				{
          key: 'age',
					title: '나이',
					dataIndex: 'age'
				}, 
				{
          key: 'school',
					title: '최종학력',
					dataIndex: 'school'
				}, 
				{
          key: 'company',
					title: '주요직장',
					dataIndex: 'company'
				},
				{
          key: 'career',
					title: '총 경력',
					dataIndex: 'career'
				},
				{
          key: 'keyword',
					title: '핵심 키워드',
          dataIndex: 'keyword',
				},
				{
          key: 'resume_title',
					title: 'Resume Title',
					dataIndex: 'resume_title'
				},
				{
          key: 'salary',
					title: '연봉',
					dataIndex: 'salary'
				},
				{
          key: 'rate',
					title: 'Rate',
					dataIndex: 'rate'
				},
				{
					title: 'Action',
          dataIndex: '',
          // 이건 나중에 지워서 breadcrumb 으로 만들기
          // row 삭제 api 필요; 예) delete/rm_code/10 이런식
          // 현재 row onClick 하면 모달이랑 같이 뜸.
					render: (text, record) => (
						this.state.dataSource.length >= 1
							? (
								<Popconfirm title='삭제?' onConfirm={() => this.handleDelete(record.key)}>
									<a href='javascript:;'>삭제</a>
								</Popconfirm>
							) : null
					),
				},
			];
    }
    
		sendMail = () => {
			alert(`send Mail to [${this.state.selectedRowKeys}]`)
			// empty after sending mail
			setTimeout(() => {
				this.setState({
					selectedRowKeys: [],
				});
			}, 1000);
		}

		onSelectChange = (selectedRowKeys) => {
			console.log('selectedRowKeys changed: ', selectedRowKeys);
			this.setState({ selectedRowKeys });
		}
		
		handleDelete = (key) => {
			const dataSource = [...this.state.dataSource];
			this.setState({ 
				dataSource: dataSource.filter(item => item.key !== key) 
			});
    }
    
    handleClick = (clickedData) => {
      this.showModal()
      this.setState({clickedData: clickedData})
    }

    fetch = () => {
        Axios.post(API.mainTable, {
            under_age: 0,
            upper_age: 40,
            top_school: true,
            keyword: '인폼'
          }).then((data) => {
          const pagination = { ...this.state.pagination };
          // Read total count from server
          // pagination.total = data.totalCount;
          pagination.total = 200;
          this.setState({
            dataSource: data.data.result,
            pagination,
          });
        });
      }
    
    async componentDidMount() {
        await this.fetch()
    }
  
    handleDelete = (key) => {
      const dataSource = [...this.state.dataSource];
      this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
    }
  
    handleAdd = () => {
      const { count, dataSource, manualKey } = this.state;
      const newData = {
				// uniq key 가 필요함; 수정 필요!

				// Warning: Each record in table should have a unique `key` prop,
				// or set `rowKey` to an unique primary key.
				
				rowKey: this.state.manualKey, // unique key 값을 안 준다 ;;
        name: 'sunny',
				age: '100',
        school: 'uc berkeley',
        company: 'codestates'
			};
      this.setState({
        dataSource: [...dataSource, newData],
				count: count + 1,
				manualKey: manualKey + 1
      });
    }
  
    handleSave = (row) => {
      const newData = [...this.state.dataSource];
      const index = newData.findIndex(item => row.key === item.key);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
			});
      this.setState({ dataSource: newData });
    }

    showModal = () => {
      this.setState({
        visible: true,
      });
    }
  
    handleOk = (e) => {
      console.log(e);
      this.setState({
        visible: false,
      });
    }
  
    handleCancel = (e) => {
      console.log(e);
      this.setState({
        visible: false,
      });
    }

    peopleModal = () => (
      <div>
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <h1>{this.state.clickedData.name}</h1>
          <h3>{this.state.clickedData.school}</h3>
          <h3>{this.state.clickedData.company}</h3>
        </Modal>
      </div>
    )
  
    render() {
			const { dataSource, selectedRowKeys } = this.state;
			const rowSelection = {
				selectedRowKeys,
				onChange: this.onSelectChange,
			};
			const hasSelected = selectedRowKeys.length > 0;
      const components = {
        body: {
          row: EditableFormRow,
          cell: EditableCell,
        },
			};
      const columns = this.columns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: record => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave: this.handleSave,
          }),
        };
      });

      console.log('clicked data', this.state.clickedData)

      return (
        <div>
					<Button 
						onClick={this.handleAdd}
						type='primary'
						icon='plus'
						style={{ marginBottom: 16 }}>
            등록
          </Button>
          <Button
						type='primary'
						icon='mail'
            onClick={this.sendMail}
						disabled={!hasSelected}
          >
            메일
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
          <Table
						components={components}
						rowKey='rm_code'
            rowClassName={() => 'editable-row'}
            bordered
						dataSource={dataSource}
            rowSelection={rowSelection}
            onRow={(record) => ({
              onClick: () => this.handleClick(record)
          })}
            columns={columns}
          />
          <this.peopleModal />
        </div>
      );
    }
  }

export default EditableTable