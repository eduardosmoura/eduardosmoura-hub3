import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Stylesheets
import '../stylesheets/app.css';
// antd components
import { Layout, Menu, Select, Button, Spin, Result } from 'antd';
//antd icons
import { UserOutlined } from '@ant-design/icons';

//components
import DoggoList from './DoggoList';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

function App() {
  const [breed, setBreed] = useState('random');
  const [subBreed, setSubBreed] = useState('');
  const [searchOptions, setSearchOptions] = useState([]);
  const [subBreedOptions, setSubBreedOptions] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);
  const [selected, setSelected] = useState([]);
  const [favorite, setFavourite] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (values) => {
    setBreed('random');
    values.length < 6 && setSelected(values.sort());
  };

  useEffect(() => {
    const fetchData = async () => {
      setHasError(false);
      setLoading(true);
      try {
        const result = await axios.get(`https://dog.ceo/api/breeds/list/all`);
        setSearchOptions(result.data.message);
      } catch (error) {
        setHasError(true);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (breed !== 'random') {
      const fetchData = async () => {
        setHasError(false);
        setLoading(true);
        try {
          const result = await axios.get(`https://dog.ceo/api/breed/${breed}/list`);
          setSubBreedOptions(result.data.message);
        } catch (error) {
          setHasError(true);
        }
        setLoading(false);
      };
      fetchData();
    }
  }, [breed]);

  return (
    <div className="app">
      <Layout>
        <Header className="header">
          <div className="header__container">
            <h1 className="header__brand--title">Doggo Search</h1>
            <Button
              className="header__container__button"
              type="ghost"
              onClick={() => {
                favorite ? setFavourite(false) : setFavourite(true);
              }}
            >
              {' '}
              {favorite ? 'Back to Search' : 'My Saved Dogs'}{' '}
            </Button>
          </div>
        </Header>

        {!favorite && (
          <div className="search__container">
            <Select
              allowClear
              style={{ minWidth: '50%' }}
              value={selected}
              placeholder="select a breed"
              size="large"
              showSearch
              optionFilterProp="children"
              mode="multiple"
              onChange={handleChange}
              className="search__container__searchbox"
            >
              {Object.keys(searchOptions).map((item) => {
                return (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                );
              })}
            </Select>
          </div>
        )}
        {loading ? (
          <Spin tip="Loading..." />
        ) : hasError ? (
          <Result
            status="error"
            title="Something Went Wrong"
            subTitle="Please reload the page, if the problem persist please contact the administrator."
          />
        ) : (
          <Content style={{ padding: '0 50px' }}>
            <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
              {
                //only appears if some breed was selected, and of not on favorites page
                selected.length > 0 && !favorite && (
                  <Sider className="site-layout-background" width={200}>
                    <Menu
                      mode="inline"
                      openKeys={openKeys}
                      defaultSelectedKeys={['all-dogos']}
                      defaultOpenKeys={['all']}
                      style={{ height: '100%' }}
                      onOpenChange={() => {}}
                    >
                      <Menu.Item
                        key="all-dogos"
                        onClick={() => {
                          setBreed('random');
                          setSelected([]);
                          setSubBreed('');
                        }}
                      >
                        all
                      </Menu.Item>
                      <Menu.Divider />

                      {selected.length > 0 &&
                        selected.map((item) => {
                          return (
                            <SubMenu
                              key={item}
                              icon={<UserOutlined />}
                              onTitleClick={() => {
                                setBreed(item);
                                setOpenKeys([item]);
                                setSubBreed('');
                              }}
                              title={item}
                            >
                              {subBreedOptions.map((sub, idx) => {
                                return (
                                  <Menu.Item key={idx} onClick={() => setSubBreed(sub)}>
                                    {sub}
                                  </Menu.Item>
                                );
                              })}
                            </SubMenu>
                          );
                        })}
                    </Menu>
                  </Sider>
                )
              }

              <Content style={{ padding: '0 24px', minHeight: 280 }}>
                <DoggoList
                  breed={breed}
                  selected={selected}
                  favorite={favorite}
                  subBreed={subBreed}
                >
                  {' '}
                </DoggoList>
              </Content>
            </Layout>
          </Content>
        )}
        <Footer style={{ textAlign: 'center' }}>Doggo Search Challenge</Footer>
      </Layout>
    </div>
  );
}

export default App;
