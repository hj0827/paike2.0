window.onload = function () {
    // 切换时间
    new Vue({
        el: '.total',
        data: {
            currentYear: '',
            currentMonth: '',
            // 遍历空格和天数
            firstDay: 0,
            daysInMonth: 0,
            // 存储被选中的日期
            selectedDays: [],
            arrdate: [],
            //用于装00-23小时的数组
            hours: [],
            minutes: [],
            // “请设置”位置的开始时间和结束时间
            selectedStartHour: '',
            selectedStartMinute: '',
            selectedEndHour: '',
            selectedEndMinute: '',
            // 提示框内容
            // “请设置”位置的星期几
            weekdays: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
            selectedWeekday: '',
            isTimeShow: {
                time1: false, // 初始化为隐藏状态
                time2: false, // 可以根据需要添加其他的元素的显示状态
            },
            imgPaths: {
                time1: 'images/downarrow4.png',
                // ...其他时间段 
                time2: 'images/downarrow4.png',
            },
            weekdayContainers: [
                { id: 1, weekday: '星期一', timePeriods: [] },
                { id: 2, weekday: '星期二', timePeriods: [] },
                { id: 3, weekday: '星期三', timePeriods: [] },
                { id: 4, weekday: '星期四', timePeriods: [] },
                { id: 5, weekday: '星期五', timePeriods: [] },
                { id: 6, weekday: '星期六', timePeriods: [] },
                { id: 0, weekday: '星期日', timePeriods: [] },
            ],
            // 用于装日期+上课时间段
            timePeriodDisplay: [], // 用于存储yearMonthDay和时间段字符串的组合
            // 取消弹窗
            isContainerVisible: false,
            contentDisplayTotal: '',
            // 判断是否删除
            isDeleteClicked: false,
            timePeriodCount: {},
            // 获取浏览器高度
            browserHeight: 0,
            deornotdel: true,
            deornotdel1: false,
            deornotdel2: false,
            displayString: '',
        },

        methods: {
            // 上一年
            oldYear() {
                this.currentYear--;
                this.GetDays();
            },
            // 上个月
            oldMonth() {
                this.currentMonth--;
                // 如果月份小于1，则年份-1，月份变成12月
                if (this.currentMonth <= 0) {
                    this.currentMonth = 12;
                    this.currentYear--;
                    // 判断月份是否小于等于9，如果是则补零
                } else if (this.currentMonth <= 9) {
                    this.currentMonth = '0' + this.currentMonth;
                }
                this.GetDays();
            },
            // 下个月
            newMonth() {
                this.currentMonth++;
                // 如果月份小于1，则年份-1，月份变成12月
                if (this.currentMonth >= 13) {
                    this.currentMonth = "01";
                    this.currentYear++;
                    // 判断月份是否小于等于9，如果是则补零
                } else if (this.currentMonth <= 9) {
                    this.currentMonth = '0' + this.currentMonth;
                }
                this.GetDays();
            },
            // 下一年
            newYear() {
                this.currentYear++;
                this.GetDays();
            },
            // 获取当前月份的天数
            GetDays() {
                const year = parseInt(this.currentYear);
                const month = parseInt(this.currentMonth);
                const daysInMonth = new Date(year, month, 0).getDate();
                // 用于生成相应的天数
                this.daysInMonth = daysInMonth;
                // console.log(this.daysInMonth);
                // 判断当前月份得第一天是周几
                const firstDay = new Date(year, month - 1, 1).getDay();
                // 用于空多少个格子
                this.firstDay = firstDay;
            },
            // 选中相应的天数，背景颜色变成粉红色(单选)
            DaysSelected(day) {
                let tipsText = "";
                const yearMonthDay = `${this.currentYear}-${this.currentMonth}-${day <= 9 ? '0' + day : day}`;
                function getWeekday(yearMonthDay) {
                    // 将日期字符串转换为 Date 对象
                    const date = new Date(yearMonthDay);
                    // 获取星期几（0 表示星期日，1 表示星期一，以此类推）
                    const weekday = date.getDay();
                    // 定义一个数组，存储星期几的文本表示
                    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
                    // 返回星期几的文本表示
                    return weekdays[weekday];
                }
                // 判断选中的日期是星期几
                const selectedWeekday = getWeekday(yearMonthDay); // 假设有一个函数getWeekday()可以获取给定日期的星期几
                if (this.selectedDays.includes(yearMonthDay)) {
                    // 如果已经选中则取消选中
                    const index = this.selectedDays.indexOf(yearMonthDay);
                    this.selectedDays.splice(index, 1);
                    tipsText = "取消：" + `${this.currentYear}-${this.currentMonth}-${day <= 9 ? '0' + day : day}`;

                    // 更新timePeriodDisplay数组
                    const selectedContainer = this.weekdayContainers.find(
                        (container) => container.weekday === selectedWeekday
                    );
                    if (selectedContainer) {
                        for (const timePeriod of selectedContainer.timePeriods) {
                            const displayString =
                                yearMonthDay +
                                " " +
                                `${timePeriod.startHour}:${timePeriod.startMinute} - ${timePeriod.endHour}:${timePeriod.endMinute}`;
                            const index = this.timePeriodDisplay.indexOf(displayString);
                            if (index !== -1) {
                                this.timePeriodDisplay.splice(index, 1);
                            }
                        }
                    }
                } else {
                    // 如果未选中则添加选中
                    // 判断选中的日期是星期几
                    const selectedWeekday = getWeekday(yearMonthDay); // 假设有一个函数getWeekday()可以获取给定日期的星期几
                    // 查找选定的星期几容器
                    const selectedContainer = this.weekdayContainers.find(
                        (container) => container.weekday === selectedWeekday
                    );
                    if (selectedContainer && selectedContainer.timePeriods.length === 0) {
                        // console.log("时间段为空，不能选中");
                        this.showTips(selectedWeekday + "时间段为空，不能选中");
                        return; // 时间段为空，不执行选中操作
                    } else {
                        this.selectedDays.push(yearMonthDay);
                        tipsText = "选中：" + `${this.currentYear}-${this.currentMonth}-${day <= 9 ? '0' + day : day}`;

                        // console.log("选中的时间：");
                        for (const yearMonthDay of this.selectedDays) {
                            // console.log(yearMonthDay);
                            for (const timePeriod of selectedContainer.timePeriods) {
                                const displayString =
                                    yearMonthDay +
                                    " " +
                                    `${timePeriod.startHour}:${timePeriod.startMinute} - ${timePeriod.endHour}:${timePeriod.endMinute}`;
                                // 检查组合字符串是否已经存在于timePeriodDisplay数组中
                                if (!this.timePeriodDisplay.includes(displayString)) {
                                    // console.log(this.timePeriodDisplay);
                                    this.timePeriodDisplay.push(displayString);
                                }
                            }
                        }
                    }
                }
                this.showTips(tipsText);
            },
            updateSelectedTimePeriods(timePeriodsHTML) {
                const timePeriodsContainer = document.getElementById('timePeriodsContainer');
                if (timePeriodsContainer) {
                    timePeriodsContainer.innerHTML = timePeriodsHTML;

                    // 获取选中的时间段元素
                    const selectedTimePeriodElements = timePeriodsContainer.getElementsByClassName('selected');

                    // 打印选中的时间段
                    // console.log('选中的时间段:');
                    for (const element of selectedTimePeriodElements) {
                        const timePeriod = element.textContent.trim();
                        // console.log(timePeriod);
                    }
                }
            },

            // 选中相应的天数，背景颜色变成粉红色(全选)
            toggleSelectAll() {
                // 提示是否全选成功
                let tipsText = "";
                // 遍历当前月份的天数
                for (let i = 1; i <= this.daysInMonth; i++) {
                    // 将每一天的年月日拼接成一个字符串
                    const date = `${this.currentYear}-${this.currentMonth}-${i <= 9 ? '0' + i : i}`;
                    // 获取日期对应的星期几
                    const weekday = new Date(date).getDay();
                    // 定义一个数组，存储星期几的文本表示
                    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
                    // 获取星期几的文本表示
                    const weekdayText = weekdays[weekday];
                    // 查找对应星期几的容器
                    const weekdayContainer = this.weekdayContainers.find(container => container.weekday === weekdayText);
                    if (weekdayContainer && weekdayContainer.timePeriods.length > 0) {
                        // 如果容器存在且有数据，则将日期添加到选中数组中
                        // **在添加之前，先判断是否已经包含了该日期**
                        if (!this.selectedDays.includes(date)) {
                            this.selectedDays.push(date);
                        }
                    }
                }

                if (this.selectedDays.length > 0) {
                    tipsText = "全选成功：" + `${this.currentYear}-${this.currentMonth}` + "月";
                } else {
                    tipsText = "无数据可选";
                }

                // console.log("选中的时间：");
                for (const date of this.selectedDays) {
                    // console.log(date);
                    const weekday = new Date(date).getDay();
                    const weekdayText = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][weekday];
                    const weekdayContainer = this.weekdayContainers.find(container => container.weekday === weekdayText);
                    if (weekdayContainer) {
                        for (const timePeriod of weekdayContainer.timePeriods.sort()) {
                            const displayString =
                                date +
                                " " +
                                `${timePeriod.startHour}:${timePeriod.startMinute} - ${timePeriod.endHour}:${timePeriod.endMinute}`;
                            if (!this.timePeriodDisplay.includes(displayString)) {
                                this.timePeriodDisplay.push(displayString);
                            }
                        }
                    }
                }

                this.showTips(tipsText);
            },

            // 全删
            toggleDeleteAll() {
                // 提示是否删除成功
                let tipsText = "";

                for (let i = 1; i <= this.daysInMonth; i++) {
                    const date = `${this.currentYear}-${this.currentMonth}-${i <= 9 ? '0' + i : i}`;
                    const index = this.selectedDays.indexOf(date);

                    if (index !== -1) {
                        this.selectedDays.splice(index, 1);
                        tipsText = "删除成功：" + `${this.currentYear}-${this.currentMonth}` + "月";
                        // 删除对应日期的时间段显示
                        const weekday = new Date(date).getDay();
                        const weekdayText = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][weekday];
                        const weekdayContainer = this.weekdayContainers.find(container => container.weekday === weekdayText);
                        if (weekdayContainer) {
                            for (const timePeriod of weekdayContainer.timePeriods.sort()) {
                                const displayString =
                                    date +
                                    " " +
                                    `${timePeriod.startHour}:${timePeriod.startMinute} - ${timePeriod.endHour}:${timePeriod.endMinute}`;
                                const displayIndex = this.timePeriodDisplay.indexOf(displayString);
                                if (displayIndex !== -1) {
                                    this.timePeriodDisplay.splice(displayIndex, 1);
                                }
                            }
                        }
                    } else {
                        // tipsText = "无需删除";
                    }
                }

                this.showTips(tipsText);
                this.PopUpAndClickToDelete1();
            },
            // 显示提示
            showTips(tipsText) {
                const container = document.querySelector(".container");
                container.style.display = "block";
                const overlay = document.querySelector(".overlay");
                overlay.style.display = "block";
                overlay.innerHTML = tipsText;
                clearTimeout(this.timerId); // 清除上一个定时器
                this.timerId = setTimeout(() => {
                    container.style.display = "none";
                }, 3000);
            },
            // 删除已选择的时间段
            PopUpAndClickToDelete() {
                this.isDeleteClicked = true;
                this.DeleteSelectedTimePeriod();
                this.showTips('删除成功');
                // 点击了“已选择”的删除，“查看已选时间也删除”
                const uniqueElements = [...new Set(this.selectedDays)];
                for (let i = 0; i < uniqueElements.length; i++) {
                    for (let j = 0; j < this.timePeriodDisplay.length; j++) {
                        const element = this.timePeriodDisplay[j];
                        const dateString = element.substring(0, 10);
                        const timeString = element.substring(11);
                        const date = new Date(dateString);
                        const daysOfWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
                        const dayOfWeek = daysOfWeek[date.getDay()];
                        if (this.selectedWeekday === dayOfWeek && timeString === this.contentDisplayTotal) {
                            this.timePeriodDisplay = this.timePeriodDisplay.filter(item => item !== element);
                        }
                    }
                    const helement = uniqueElements[i];
                    // console.log(helement);
                    const date = new Date(helement);
                    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
                    const dayOfWeekd = weekdays[date.getDay()];
                    // console.log(helement + '是' + dayOfWeekd);
                    this.weekdayContainers.forEach(weekdayContainer => {
                        const timePeriodCount = weekdayContainer.timePeriods.length;
                        // console.log(`${weekdayContainer.weekday}: ${timePeriodCount}`);
                        if (`${weekdayContainer.weekday}` == dayOfWeekd && `${timePeriodCount}` == 0) {
                            // console.log(`${weekdayContainer.weekday}`);
                            // 使用 filter() 方法删除 this.selectedDays 中与 helement 匹配的元素  
                            this.selectedDays = this.selectedDays.filter(day => day !== helement);
                        }
                    });
                }
            },
            // 删除已选时间
            PopUpAndClickToDelete1() {
                // console.log(this.contentDisplayTotal);
                // console.log(this.timePeriodDisplay);
                // 根据点击的已选时间来删除相应数组中的数据
                const foundIndex = this.timePeriodDisplay.findIndex(item => item === this.contentDisplayTotal);
                if (foundIndex !== -1) {
                    //   console.log("索引：" + foundIndex);
                    this.timePeriodDisplay.splice(foundIndex, 1);
                }
                // 删除后，根据已选时间去重后的日期，重新渲染日历表的背景色（将数据添加到装日历的表中）
                // 先清空数组
                this.selectedDays = [];
                for (let j = 0; j < this.timePeriodDisplay.length; j++) {
                    const element = this.timePeriodDisplay[j];
                    const dateString = element.substring(0, 10);
                    // console.log(dateString);
                    // console.log(" 前数组"+this.selectedDays);
                    this.selectedDays.push(dateString);
                }
                // console.log("后数组"+this.selectedDays);
                // 隐藏提示框
                this.isContainerVisible = false;
            },
            // 显示已选时间
            ShowSelectedTime(displayString) {
                this.deornotdel = false;
                this.deornotdel1 = true;
                this.deornotdel2 = false;
                this.isContainerVisible = true;
                // 在这里处理点击事件并获取相应的displayString值
                // console.log(displayString);
                this.contentDisplayTotal = displayString;
            },

            // 显示删除页面
            DeleteSelectedTimePeriod() {
                const selectedWeekdayContainer = this.sortedWeekdayContainers.find(weekdayContainer => weekdayContainer.weekday === this.selectedWeekday);
                if (selectedWeekdayContainer) {
                    selectedWeekdayContainer.timePeriods = selectedWeekdayContainer.timePeriods.filter(timePeriod => !this.isTimePeriodSelected(timePeriod));
                }
                this.isContainerVisible = false;
                this.isDeleteClicked = false;
            },

            isTimePeriodSelected(timePeriod) {
                return (
                    timePeriod.startHour === this.selectedTimePeriod.startHour &&
                    timePeriod.startMinute === this.selectedTimePeriod.startMinute &&
                    timePeriod.endHour === this.selectedTimePeriod.endHour &&
                    timePeriod.endMinute === this.selectedTimePeriod.endMinute
                );
            },

            DeleteClassTimePeriod(timePeriod, weekdayContainer) {
                this.deornotdel = true;
                this.deornotdel1 = false;
                this.deornotdel2 = false;
                this.selectedWeekday = weekdayContainer.weekday; // 保存选中的星期几
                this.selectedTimePeriod = timePeriod;
                this.contentDisplayTotal = timePeriod.startHour + ':' + timePeriod.startMinute + ' - ' + timePeriod.endHour + ':' + timePeriod.endMinute;
                this.isContainerVisible = true;
            },
            // 弹窗取消
            PopupCancellation() {
                this.isContainerVisible = false;
                this.isDeleteClicked = false;
                this.showTips('取消操作');
            },
            // 生成00~23
            setHours() {
                for (let i = 0; i <= 23; i++) {
                    const paddedHour = i.toString().padStart(2, '0');
                    this.hours.push(paddedHour);
                }
            },
            // 生成分钟
            setMinutes() {
                for (let i = 0; i <= 59; i++) {
                    const paddedMinutes = i.toString().padStart(2, '0');
                    this.minutes.push(paddedMinutes);
                }

            },
            // 点击“确定”
            fixHour() {
                let tipsText = "";
                const startHour = this.selectedStartHour;
                const startMinute = this.selectedStartMinute;
                const endHour = this.selectedEndHour;
                const endMinute = this.selectedEndMinute;
                const selectedWeekday = this.selectedWeekday;
                // console.log('选择的星期：', selectedWeekday);
                // console.log('开始时间：', startHour, ':', startMinute);
                // console.log('结束时间：', endHour, ':', endMinute);
                if (!startHour || !startMinute || !endHour || !endMinute || !selectedWeekday) {
                    if (!endMinute) {
                        tipsText = "请选择结束分钟";
                    }
                    if (!endHour) {
                        tipsText = "请选择结束时间";
                    }
                    if (!startMinute) {
                        tipsText = "请选择开始分钟";
                    }
                    if (!startHour) {
                        tipsText = "请选择开始时间";
                    }
                    if (!selectedWeekday) {
                        tipsText = "请选择星期";
                    }
                    // 弹出错误提示
                    this.showTips(tipsText);
                } else {
                    // 开始时间不能小于等于结束时间，已经有的区间时间，不能再添加
                    // 检查开始时间是否小于等于结束时间
                    if (startHour > endHour || (startHour === endHour && startMinute >= endMinute)) {
                        // 开始时间大于等于结束时间，弹出提示
                        // 弹出错误提示
                        this.showTips("开始时间不能小于等于结束时间");
                    } else {
                        this.addTimePeriod();
                    }
                }

            },

            addTimePeriod() {
                // 获取选择的开始时间和结束时间
                const startHour = this.selectedStartHour;
                const startMinute = this.selectedStartMinute;
                const endHour = this.selectedEndHour;
                const endMinute = this.selectedEndMinute;
                // 查找选定的星期几容器
                const selectedContainer = this.weekdayContainers.find(container => container.weekday === this.selectedWeekday);
                // 检查是否已存在相同时间段
                const isDuplicate = selectedContainer.timePeriods.some(period => {
                    return period.startHour === startHour && period.startMinute === startMinute && period.endHour === endHour && period.endMinute === endMinute;
                });
                if (isDuplicate) {
                    // 如果已存在相同时间段，则不添加
                    this.showTips('重复的时间段,无法添加。');
                    return;
                }
                // 检查是否存在重叠时间段或跨区间
                const isOverlapping = selectedContainer.timePeriods.some(period => {
                    const periodStart = period.startHour * 60 + period.startMinute;
                    const periodEnd = period.endHour * 60 + period.endMinute;
                    const newStart = startHour * 60 + startMinute;
                    const newEnd = endHour * 60 + endMinute;
                    return (periodStart <= newStart && newStart <= periodEnd) || (periodStart <= newEnd && newEnd <= periodEnd);
                });
                if (isOverlapping) {
                    // 如果存在重叠时间段或跨区间，则不添加
                    this.showTips('重叠时间段,无法添加。');
                    return;
                }
                // 向选定的星期几容器中添加新的时间段数据
                selectedContainer.timePeriods.push({
                    id: selectedContainer.timePeriods.length + 1,
                    startHour,
                    startMinute,
                    endHour,
                    endMinute
                });
                // 添加成功提示
                this.showTips('成功添加时间段。');
            },

            // 关闭或打开显示
            TurnOffOrOnDisplay(timeKey) {
                this.isTimeShow[timeKey] = !this.isTimeShow[timeKey]; // 切换显示状态  
                // 切换图片路径  
                if (this.imgPaths[timeKey] === 'images/downarrow4.png') {
                    this.imgPaths[timeKey] = 'images/uparrow4.png';
                } else {
                    this.imgPaths[timeKey] = 'images/downarrow4.png';
                }
            },
            // 清空时间段
            ClearTimePeriod() {
                this.contentDisplayTotal = "清空时间段？"
                this.isContainerVisible = true;
                this.deornotdel = false;
                this.deornotdel1 = false;
                this.deornotdel2 = true;
               
            },

            PopUpAndClickToDelete2() {
                this.selectedDays = [];
                this.timePeriodDisplay = [];
                // 清空 weekdayContainers 数组中每个对象的 timePeriods 属性
                for (let i = 0; i < this.weekdayContainers.length; i++) {
                    this.weekdayContainers[i].timePeriods = [];
                }
                this.isContainerVisible = false;
            }


        },
        mounted() {
            // 获取当前时间
            const currentDate = new Date();
            // 获取当前年
            this.currentYear = currentDate.getFullYear().toString();
            // 获取当前月
            this.currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            // 调用相应的天数
            this.GetDays();
            // 调用00~23小时
            this.setHours();
            // 分钟
            this.setMinutes();
            // 浏览器高度
            this.browserHeight = window.innerHeight;
        },
        // 在Vue组件的computed属性中添加以下代码
        computed: {
            // “查看时间排序”排序
            sortedTimePeriodDisplay() {
                return this.timePeriodDisplay.sort();
            },
            // 计算“查看时间排序”的数量
            specificTimeDisplayCount() {
                return this.sortedTimePeriodDisplay.length;
            },
            // 排序“已选择”
            sortedTimePeriods() {
                return this.weekdayContainers.sort();
            },
            // 定义一个计算属性sortedWeekdayContainers
            sortedWeekdayContainers: function () {
                // 返回一个新的星期数组
                return this.weekdayContainers.map(weekday => {
                    // 对每个星期的时间段进行排序
                    weekday.timePeriods.sort((a, b) => {
                        // 如果开始小时相同，比较开始分钟
                        if (a.startHour === b.startHour) {
                            return a.startMinute - b.startMinute;
                        }
                        // 否则，比较开始小时
                        return a.startHour - b.startHour;
                    });
                    // 返回排序后的星期对象
                    return weekday;
                });
            }

        }
    });





}