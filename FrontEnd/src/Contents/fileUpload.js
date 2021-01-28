import React, { Component } from 'react';
import axios from 'axios'
import {Col, Card, CardHeader, CardBody,Row, Button, CardImg} from 'reactstrap'
import Container from 'reactstrap/lib/Container';

export default class FilesUploadComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedFile:null,
            data: [],
            gotData: false
        }
    }

    onChangeHandler=e=>{
        e.preventDefault();
        this.setState({
          selectedFile: e.target.files[0],
          loaded: 0,
        })
        console.log(e.target.files[0])
      }



    handleSubmit = () => {
        console.log('in hanle submit')

        const formData = new FormData();
        formData.append("file", this.state.selectedFile);

        console.log("formData is")
        console.log(formData)

        const token = localStorage.getItem('token')
        console.log("token is " + `Bearer ${token}`)

        axios.post(`http://${window.location.hostname}:3005/uploadFile`, formData, {
            headers: {
                'Authorization': `Bearer ${token}` 
            } 
            // receive two    parameter endpoint url ,form data
        })  
        .then((response) => {
            // setResponse(response.data);
            console.log("Response");
            console.log(response)
            // if (response.status === 200) {
            //     console.log("Created");
            //     alert("Created!")
            // }
            alert("Saved")
            window.location.reload();
        }).catch((error) => {
            console.log("error");
            console.log(error)
            alert("saving err")
        })
        
    }

    async componentDidMount(){
        var dataReceived = await axios.get(`http://${window.location.hostname}:3005/fetchFiles`);
        console.log(dataReceived)


        this.setState({data: dataReceived.data, gotData:true})
    }
    render() {
        console.log(this.state.data)
        return (
            <Container fluid>
                <div className="row">
                    <Col md={3} className="">
                        <form>
                            <h3> <b> Book Upload </b></h3>
                            <div className="form-group">
                                <input onChange={this.onChangeHandler} type="file" />
                            </div>
                            <div className="form-group">
                                <Button block outline onClick={this.handleSubmit}>Upload</Button>
                            </div>
                        </form>
                    </Col>
                    <Col>
                    <Row>
                        {this.state.gotData ?
                            this.state.data.reverse().map((item) => {

                                return (
                                    // <div className="c">
                                    <Col md={3}>
                                    <Card>
                                        <CardHeader></CardHeader> 
                                        <CardBody>
                                            {/* <Row className="align-items-center"> */}
                                                <Col className="d-block justify-content-center align-self-center"> 
                                                    <img class="d-block img-fluid rounded mx-auto" src={`http://${window.location.hostname}:3005/${item.fileName}`} />
                                                    <hr></hr>
                                                    <p>Book Name: {item.fileName}  </p>
                                                    {/* <CardImg style={{maxHeight:'50vh'}} src={`http://${window.location.hostname}:3005/${item.fileName}`}  /> */}
                                                </Col>
                                                
                                                {/* <img src={`http://${window.location.hostname}:3005/${item.fileName}`}> </img> */}
                                                {/* {JSON.stringify(item)} */}
                                            {/* </Row> */}
                                            
                                        </CardBody>
                                    </Card>
                                    </Col>
                                )
                            })
                        :
                        <>Fetchng Data..</>
                        }
                        </Row>
                        <br />
                        <p style={{textAlign:"right"}}>* Already uploaded files can not be uploaded again ! </p>
                        
                    </Col>
                    
                </div>
            </Container>
        )
    }
}