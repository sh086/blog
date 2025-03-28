# DeepSeek- 探索未至之境

> [官网](https://www.deepseek.com/) | [API开放平台](https://platform.deepseek.com/usage) | [API 文档](https://api-docs.deepseek.com/zh-cn/) | [GitHub](https://github.com/deepseek-ai) | [秘塔搜索](https://metaso.cn/) | [本地部署](https://github.com/ollama/ollama)



## 快速开始

​	　DeepSeek普通用户可以在[官网](https://www.deepseek.com/)使用，开发者可以通过[API开放平台](https://platform.deepseek.com/usage)调用，也可从[GitHub](https://github.com/deepseek-ai)拉取模型进行本地算力部署。

​	　网页端默认使用的是`指令模型V3`可以解决搜索类问题，打开`深度思考(R1)`后可以解决需要逻辑推理的问题。此外，DS是为数不多**支持联网搜索的推理大模型**，若提问的问题在训练模型的知识截止时间之后，还可以打开`联网搜索`。

> PS：可以通过问DeepSeek："你训练的模型截止时间是什么时间" 来确认模型的知识截止时间



## 指南

### 如何进行提问

​	　DS是推理模型，与之前的指令模型相比，对提示词的要求是降低了的。与`DS`沟通可以使用**乔哈里视窗**划分为以下四种情况，常用的一般是标红的两种模式。

|              | **人知道**                                                   | **人不知道**                                           |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------ |
| **AI知道**   | 简单说                                                       | **<span style="color:red;">如何提出更好的问题</span>** |
| **AI不知道** | **<span style="color:red;">喂模式：</span>**<br />- 举例法：提供具体例子，让AI理解例子中的模式<br />- 定义字典：如专业术语、业内黑化<br />- RAG：提供本地文件、联网检索 | 开放聊                                                 |

​	　一般提问的模板可以采用 `我是谁 (+ 背景信息) + 目标`  这一固定句式。其中，`我是谁` 用于**明确受众和风格**；`背景信息` 用于给`DS`提供更多的信息。

​	　除尽可能的描述问题外，也可以使用 **联网检索** 或 **上传附件** 等方式提供额外的信息 ，或在提问时加上`如果有需要补充的信息可以向我提问`的话术 以及 对DS提出反复斟酌、复盘等要求，进行反馈与迭代优化。



> [!WARNING] 更多的提问技巧
> ① 不需在要给模型指定具体角色，DS内置的就是通识专家角色<br/>
> ② 超200字的冗长提示词或者宽泛话题、复杂的句式、模糊的词语都可能会污染关键词<br/>③ 不要使用否定句式，否定句式会增加大模型成本<br/>④ 只需要给模型目标，不要指定分步骤思考的过程  [AI知人不知时，DS的深度思考更具有价值]<br/>⑤ 对于复杂问题，需要人工进行分步拆解 [存在上下文联系最大长度限制]

## 实例

（1）Mermaid图

​	　我需要了解跨境电商发货和收货具有哪些环节和流程，**请用mermaid图标的语法绘制流程图**，尽可能详尽，如果有需求补充信息，可以向我提问

​	　用MarkDown表格对比IPhone16和华为Mate70的屏幕、价格、电池和摄像头参数，参考京东的数据。

（2）DeepSeek + Kimi 制作PPT

第一步：了解新能源汽车换电站行业发展，希望绘制10页的PPT，以文本的形式给出PPT的详细内容。

第二步：打开Kimi，选择PPT助手
第三步：将DS生成的内容发送给PPT助手，并在内容之前补充：请跟进下面内容生成一份PPT

（3）写简历
	　我是一名本科生，xx年毕业，大学专业为软件工程，目前掌握的专业技能有Java技术，熟悉JUc，熟悉
SpringMvc工作流程，熟悉使用SpringBoot框架、MysQL数据库优化及Redis缓存，熟练使用RabbitMQ、
Nginx，熟悉Js，VUE和Thymeleaf等等。做过Java架构方面的工作。做过线上教育行业、电商行业的的项
目，做过直播相关的项目，自己带领过10人的开发团队。现在你帮我写一份应聘Java高级工程师岗位的
简历

（4）模拟面试

现在你是一个Java面试官，你在面试我，我来应聘的是Java后台开发的职位，技术栈包括java，mysql，
linux，SSM，SpringBoot，SpringCloud，JVM，JUc，Redis。请结合我的技术栈范围向我提问。你问一个
问题，就等我回答一个问题。我回答后，你要评价我的回答如何，有哪些地方不太对。然后你再问下一
个问题



# 实用集成

https://github.com/deepseek-ai/awesome-deepseek-integration/blob/main/README_cn.md



https://www.bilibili.com/video/BV1uqKGeZEy1?spm_id_from=333.788.player.switch&vd_source=f87f39b1af12eeb6301c7d9944f97ec9&p=25