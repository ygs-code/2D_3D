import React, {useEffect, useRef} from 'react';
import ReactDOM from 'react-dom/client';
import G6 from '@antv/g6';
import {Rect, Text, Image, Polygon, createNodeFromReact} from '@antv/g6-react-node';
import PropTypes from 'prop-types';
// 自定义组件 https://blog.csdn.net/qq_31644543/article/details/123850796
 

const CustomNode = (props={}) => {
 
    const {cfg} = props;
    const {label, id} = cfg;
 
  
    return (
      <Rect keyShape style={{
            width: 100,
            height: 200,
            fill: '#1890ff',
            stroke: '#1890ff',
            radius: [6, 6, 6, 6]
       }}
      name="test">
      <Text style={{ 
        margin: [2, 0, 0, 50],
        textAlign: 'center', 
        fontWeight: 'bold', 
        fill: '#fff'
      }} 
          name="title">{label || id}</Text>
      {/* <Polygon style={{points:[[ 30, 30 ], [ 40, 20 ], [ 30, 50 ], [ 60, 100 ]], fill: 'red'}} /> */}

          <Image style={{img: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png', width: 48, height: 48, margin: [0, 0, 0, 0]}} />
    </Rect>
    );
  };
CustomNode.propTypes = { 
    cfg:PropTypes.object
  };

const App = () => {
    const ref = useRef();
  
    
  
    useEffect(() => {
      if (!ref.current) return;

      
      G6.registerNode('icon-node', createNodeFromReact(CustomNode));

         // 自定义 icon-node 节点
        //  G6.registerNode(
        //     'icon-node',
        //     {
        //       draw(cfg, group) {

        //         const styles =  this.getShapeStyle(cfg);
        //         const {labelCfg = {}} = cfg;
        //         const w = styles.width;
        //         const h = styles.height;
        //         const keyShape = group.addShape('rect', {
        //           attrs: {
        //             ...styles,
        //           },
        //         });
        //         if (cfg.label) {
        //           group.addShape('text', {
        //             attrs: {
        //               ...labelCfg.style,
        //               text: cfg.label.split('').join('\n'), // 换行
        //               y: 108- h / 2+ cfg.label.length * 8,
        //             },
        //           });
        //         }
        //         return keyShape;
        //       },
        //       update: undefined,
        //     },
        //     'rect'
        //   );
          
          // 自定义 flow-line 线
          G6.registerEdge('flow-line', {
            draw(cfg, group) {
              const startPoint = cfg.startPoint;
              const endPoint = cfg.endPoint;
              const {style} = cfg;
              const shape = group.addShape('path', {
                attrs: {
                  stroke: style.stroke,
                  lineWidth: 2,// 描边粗细
                  lineCap: 'round', // 设置线条的结束端点样式
                  lineJoin: 'round', // 两条线相交时，所创建的拐角形状（bevel斜角、round圆角、miter尖角）
                  endArrow: style.endArrow,
                  path: [
                    ['M', startPoint.x, startPoint.y],
                    ['V', (startPoint.y) + 150], // 画一条垂直线到指定x坐标
                    ['H', endPoint.x - 0],
                    ['L', endPoint.x, endPoint.y],
                  ],
                  // path: [
                  //   ['M', startPoint.x, startPoint.y],
                  //   ['L', startPoint.x, (startPoint.y + endPoint.y) / 2],
                  //   ['L', endPoint.x, (startPoint.y + endPoint.y) / 2],
                  //   ['L', endPoint.x, endPoint.y],
                  // ],
                },
              });
              return shape;
            },
          });
     
        
        
        
  
      const    treeData = {
          id: "root",
          label: "新机场建设项目",
          children: [
            {
              id: "c1",
              label: "航站区",
              children: [
                {
                  id: "c1-1",
                  label: "旅客航站楼",
                  children: [
                    {
                      id: "c1-1-1",
                      label: "主航站楼",
                    },
                    {
                      id: "c1-1-2",
                      label: "连接楼",
                    },
                    {
                      id: "c1-1-3",
                      label: "登机楼",
                    },
                  ],
                },
                {
                  id: "c1-2",
                  label: "塔台",
                },
                {
                  id: "c1-3",
                  label: "机场酒店、停车楼",
                },
                {
                  id: "c1-4",
                  label: "大关小学",
                },
              ],
            },
            {
              id: "c2",
              label: "飞行区",
              children: [
                {
                  id: "c2-1",
                  label: "跑道",
                  children: [
                    {
                      id: "c2-1-1",
                      label: "一号跑道",
                    },
                    {
                      id: "c2-1-2",
                      label: "二号跑道",
                    },
                  ],
                },
                {
                  id: "c2-2",
                  label: "滑行道",
                  children: [
                    {
                      id: "c2-2-1",
                      label: "滑行道入口",
                    },
                    {
                      id: "c2-2-2",
                      label: "滑行道出口",
                    },
                  ],
                },
                {
                  id: "c2-3",
                  label: "停机坪",
                  children: [
                    {
                      id: "c2-3-1",
                      label: "客机坪",
                    },
                    {
                      id: "c2-3-2",
                      label: "货机坪",
                    },
                    {
                      id: "c2-3-3",
                      label: "商务机坪",
                    },
                  ],
                },
              ],
            },
            {
              id: "c3",
              label: "工作区",
              children: [
                {
                  id: "c3-1",
                  label: "飞机维修区",
                },
                {
                  id: "c3-2",
                  label: "航空食品区",
                },
                {
                  id: "c3-3",
                  label: "油库区",
                },
                {
                  id: "c3-4",
                  label: "环保设施区",
                },
                {
                  id: "c3-5",
                  label: "机场当局、航空公司办公楼",
                },
              ],
            },
          ],
        };
      
              // 机构树 DOM 节点
        const container = ref.current;
        const width = container.scrollWidth;
        const height = container.scrollHeight;
              
        const graph = new G6.TreeGraph({
            container:   ref.current , //'org-tree',
           width: 1000,
           height: 800,
            linkCenter: true, // 设置边连入节点的中心，以保证美观性
            modes: {
              default: ['drag-canvas', 'zoom-canvas'],
              // default: ['drag-canvas', 'drag-node'],
            }, // 树图模式
     
            // 节点总览：https://g6.antv.antgroup.com/manual/middle/elements/nodes/default-node
            defaultNode: {
              type: 'icon-node', // 指定节点类型 icon-node、circle、rect
              // size: [120, 40],
              size: [40, 216], // 节点的大小 [120, 40]、[48, 216]
              style: {
                fill: '#000',
                stroke: 'l(30) 0:#ffffff 0.5:#7ec2f3 1:#1890ff', // #40a9ff、l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff
                radius: 4, // 描边圆角
                lineWidth: 2,// 描边粗细
                // lineDash: [3, 5], // 描边虚线，数组代表实、虚长度
              },
              labelCfg: {
                style: {
                  fill: '#fff',
                  fontSize: 14,
                  fontWeight: 'bolder',
                  textAlign:'center',
                },
              }, // 文本配置项
            },
     
            // 边总览：https://g6.antv.antgroup.com/manual/middle/elements/edges/default-edge
            defaultEdge: {
              type: 'flow-line', // 指定边的类型 line、flow-line
              style: {
                stroke: 'l(45) 0:#FF0000 0.5:#FF0000 1:#FF0000', // #5294FF、l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff
                fillOpacity: 0.5,
                lineOpacity: 0.1,
                shadowBlur: 10,
                // endArrow: {
                //   path: "M 0,0 L 12, 6 L 9,0 L 12, -6 Z",
                //   fill: "#5294FF",
                //   d: -110,
                // }, // 结束箭头
              }, // 边的样式属性
            },
     
            // 节点状态：https://g6.antv.antgroup.com/manual/middle/states/state
            nodeStateStyles: {
              type: 'polyline-edge',
              hover: {
                stroke: "#1890ff",
                lineWidth: 2,
              },
            },
     
            // 边状态：https://g6.antv.antgroup.com/manual/middle/states/state
            edgeStateStyles: {},
     
            layout: {
              type: 'compactBox', // 布局类型，支持 dendrogram、compactBox、mindmap、indeted
              direction: 'TB', // 布局方向，有  LR , RL , TB , BT , H , V ，说明（L：左；R：右；T：上；B：下；H：垂直；V：水平）
              getId: (d) => {return d.id;},
              getWidth: () => {return 180;}, // 每个节点的宽度
              getHeight: () => {return 200;}, // 每个节点的高度
              getVGap: () => {return 50;}, // 每个节点的水平间隙
              getHGap: () => {return 40;}, // 每个节点的垂直间隙
            },
          });
     
          graph.data(treeData); // 载入数据
          graph.render(); // 渲染视图
          graph.fitView(); // 自适

            // 监听鼠标移入事件
        graph.on('node:mouseenter', (evt) => {
            const {item} = evt;
            graph.setItemState(item, 'hover', true);
          });

          graph.on('node:click', (ev) => {
            const node = ev.item; // 被点击的节点元素
            const shape = ev.target; // 被点击的图形，可根据该信息作出不同响应，以达到局部响应效果

            console.log('node==',node);

            // ... do sth
          });
     
          // 监听鼠标移出事件
          graph.on('node:mouseleave', (evt) => {
            const {item} = evt;
            graph.setItemState(item, 'hover', false);
          });
     
          // 监听画布缩放事件
          if (typeof window !== 'undefined')
            window.addEventListener('resize', () => {
              if (!graph || graph.get('destroyed'))
                return;
     
              if (!container || !container.scrollWidth || !container.scrollHeight)
                return;
     
              graph.changeSize(0, 0);
              graph.changeSize(container.scrollWidth, container.scrollHeight-3);
              graph.fitView();
            });
    
    }, []);
  
    return <div ref={ref} id='container'></div>;
  };



window.onload=()=>{
    const rootElement = document.getElementById('root');
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
};


