# swap交换分区

​	　在 Linux系统中，SWAP（交换分区）可以把一部分硬盘空间虚拟成内存使用，将系统内非活动内存换页到`SWAP`，以提高系统可用内存。虽说使用**磁盘空间作为内存会影响程序运行的效率**，但至少不会让服务器死机。注意，生产环境不建议配置`SWAP`。



## 新建交换分区

​	　首先，创建一块空间，这里的文件路径可以任意，块的大小也是任意设定的，一般设置成`1M`，块的数量是`swap`交换分区的大小。

```shell
# 语法格式
dd if=/dev/zero of=<文件路径> bs=<块的大小> count=<块的数量>

# 指定一块1024M的交换分区
# 官方建议交换分区为物理内存的1.5倍
dd if=/dev/zero of=/mnt/ice.swap bs=1M count=1024
```

​	　然后，将文件设置为交换分区文件，并启动。

```shell
# 设置交换分区文件权限为600
sudo chmod 600 /mnt/ice.swap

# 将文件设置为交换分区文件
mkswap /mnt/ice.swap
# 启用交换分区文件
swapon /mnt/ice.swap

# 注意：提示如下错误说明分区文件已被重复挂载
swapon: /mnt/ice.swap: swapon failed: Device or resource busy
```

​	　修改配置文件`/etc/rc.local`，并设置开机时，自动启动`swap`分区。

```shell
# 如果在 /etc/rc.local中有 swapoff -a 需要修改为 swapon -a
cat /etc/rc.local

# 在 /etc/fstab 中添加如下一行，使得开机时自动启动swap分区
/mnt/ice.swap swap swap defaults 0 0
```

​	　接着，修改 `swpapiness` 参数，该参数值用来确定系统对 `Swap` 分区的使用规则。当 `swappiness` 为 `0` 时，表示最大限度地使用物理内存，即在物理内存全部使用完之后，再使用 `Swap` 分区 。

​	　当 `swappiness` 为 `0-100` 时，如为 `20`，则表示当物理内存剩下 `20%` 时，就使用 `Swap` ；当 `swappiness` 为 `100` 时，表示积极使用 `Swap` 分区，系统会将内存中的数据及时置换到 Swap 分区。

```shell
# 临时设置
echo 100 >/proc/sys/vm/swappiness
# 永久设置,在 /etc/sysctl.conf最后添加
vm.swappiness=100
```



## 关闭分区

​	　如果觉得内存又足够了不需要分区，可以将 swappiness 调低，又或者将该分区关闭，

```shell
# 关闭分区
swapoff <swap文件路径>

# 取消自动挂载，将我们添加的自启动去掉
vim /etc/fstab

# 确认分区已关闭
free -m

# 设置 swappiness 参数
# 临时设置
echo 0 >/proc/sys/vm/swappiness
# 永久设置，将我们设置的参数去掉
vim /etc/sysctl.conf

# 最后删除不需要的分区文件
rm -rf /mnt/ice.swap
```



## 扩展分区

​	　如果在使用的过程中，发现分区不够用了，可以对分区进行拓展，**按步骤新建一个分区，启动就可以用了**。

