<div class="widget widget-search">
	<form class="ultimate-search" method="get" id="searchform" action="<?php  echo esc_url(home_url('/search/')); ?>/">
		<?php
			$search_val = get_search_query();
			if( empty($search_val) ){
				$search_val = __("Type keywords..." , "umeed");
			}
		?>sss
	<input type="text" name="search" id="s" placeholder="Type Keywords" autocomplete="off" data-default="<?php echo esc_attr($search_val); ?>" />
	<label><input type="submit" value="Type keywords" placeholder="Type keywords"></label>
  </form>
</div>